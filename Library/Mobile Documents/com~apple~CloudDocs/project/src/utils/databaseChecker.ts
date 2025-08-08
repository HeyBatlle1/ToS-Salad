import supabase from '../services/supabase';

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  authenticated: boolean;
  message: string;
}> {
  try {
    // Try a simple query to check connectivity
    const { error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });
    
    // If we get a specific error about the relation not existing, that's still a successful connection
    if (error && error.code === '42P01') {
      return { 
        connected: true, 
        authenticated: false,
        message: 'Connected but table "user_profiles" does not exist'
      };
    }
    
    if (error) {
      return { 
        connected: false, 
        authenticated: false,
        message: `Connection failed: ${error.message}`
      };
    }
    
    return { 
      connected: true, 
      authenticated: true,
      message: 'Successfully connected to database'
    };
  } catch (error) {
    console.error('Database connection check error:', error);
    return { 
      connected: false, 
      authenticated: false,
      message: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

export async function checkDatabaseSchema(): Promise<{
  success: boolean;
  missingTables: string[];
  missingColumns: { table: string; column: string }[];
  message: string;
}> {
  try {
    // List of required tables and columns for the application
    const requiredTables = [
      'user_profiles',
      'notification_preferences',
      'safety_reports',
      'analysis_history',
      'chat_messages',
      'risk_assessments',
      'watched_videos'
    ];
    
    const requiredColumns: Record<string, string[]> = {
      'user_profiles': ['id', 'role', 'created_at', 'is_active'],
      'notification_preferences': [
        'user_id', 'email_notifications', 'push_notifications',
        'certification_expiry_alerts', 'safety_alerts'
      ],
      'analysis_history': ['user_id', 'query', 'response', 'type', 'created_at']
    };
    
    // Check if tables exist
    let missingTables: string[] = [];
    let existingTables: string[] = [];
    
    try {
      // Try to get a list of tables from Supabase
      const { data: tables, error: tableError } = await supabase
        .from('get_tables')
        .select();
      
      if (tableError) {
        // If the function doesn't exist, try a different approach
        if (tableError.code === '42883') { // undefined_function
          // Query information_schema directly
          const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');
            
          if (error) {
            throw error;
          }
          
          if (data) {
            existingTables = data.map(t => t.table_name);
          }
        } else {
          throw tableError;
        }
      } else if (tables) {
        existingTables = tables;
      }
    } catch (error) {
      console.error('Error checking tables:', error);
      
      // Fall back to checking each table individually
      for (const table of requiredTables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('count', { count: 'exact', head: true });
          
          // If error is not about table not existing, assume table exists
          if (!error || error.code !== '42P01') {
            existingTables.push(table);
          }
        } catch (tableError) {
          // Ignore errors
        }
      }
    }
    
    // Find missing tables
    missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    // Check for missing columns in existing tables
    let missingColumns: { table: string; column: string }[] = [];
    
    // Only check columns for tables that exist
    for (const table of Object.keys(requiredColumns)) {
      // Skip if table is missing and not checking individual tables
      if (missingTables.includes(table)) {
        continue;
      }
      
      try {
        // Try to get columns for this table
        const { data: columns, error } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', table);
          
        if (error) {
          console.error(`Error checking columns for ${table}:`, error);
          continue;
        }
        
        const columnNames = columns?.map(c => c.column_name) || [];
        
        for (const column of requiredColumns[table]) {
          if (!columnNames.includes(column)) {
            missingColumns.push({ table, column });
          }
        }
      } catch (columnError) {
        console.error(`Error checking columns for ${table}:`, columnError);
      }
    }
    
    // Create status message
    let message = '';
    if (missingTables.length === 0 && missingColumns.length === 0) {
      message = 'Database schema is compatible with the application';
    } else if (missingTables.length > 0) {
      message = `Missing tables: ${missingTables.join(', ')}`;
    } else if (missingColumns.length > 0) {
      message = `Missing columns in tables`;
    }
    
    return {
      success: missingTables.length === 0 && missingColumns.length === 0,
      missingTables,
      missingColumns,
      message
    };
  } catch (error) {
    console.error('Database schema check error:', error);
    return {
      success: false,
      missingTables: [],
      missingColumns: [],
      message: error instanceof Error ? error.message : 'Unknown schema check error'
    };
  }
}