-- Database schema for The Verifier integration
-- Extends ToS Salad database with content verification capabilities

-- Table for storing ToS Salad verification reports (privacy-compliant)
CREATE TABLE IF NOT EXISTS tos_verification_reports (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    input_type VARCHAR(20) NOT NULL CHECK (input_type IN ('file', 'url')),
    overall_verdict VARCHAR(50) NOT NULL,
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')),
    analysis_summary JSONB,
    module_count INTEGER DEFAULT 0,
    privacy_compliant BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing ToS Salad AI detection results (aggregated data only)
CREATE TABLE IF NOT EXISTS tos_ai_detection_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_analyses INTEGER DEFAULT 0,
    ai_generated_count INTEGER DEFAULT 0,
    likely_authentic_count INTEGER DEFAULT 0,
    analysis_failed_count INTEGER DEFAULT 0,
    average_ai_score DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
);

-- Table for tracking ToS Salad safety scan results (no personal data)
CREATE TABLE IF NOT EXISTS tos_safety_scan_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_scans INTEGER DEFAULT 0,
    threats_detected INTEGER DEFAULT 0,
    safe_results INTEGER DEFAULT 0,
    url_scans INTEGER DEFAULT 0,
    file_scans INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
);

-- Table for ToS Salad provenance check patterns (educational data)
CREATE TABLE IF NOT EXISTS tos_provenance_patterns (
    id SERIAL PRIMARY KEY,
    pattern_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    risk_level VARCHAR(10) NOT NULL,
    educational_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial ToS Salad provenance patterns for education
INSERT INTO tos_provenance_patterns (pattern_type, description, risk_level, educational_notes) VALUES
('no_matches_found', 'Content not found elsewhere online', 'LOW', 'Could be original content or very new. Not necessarily suspicious.'),
('single_source', 'Content found at one other location', 'LOW', 'May indicate original source or limited distribution.'),
('multiple_sources', 'Content found at 2-10 locations', 'MEDIUM', 'Content has been shared or republished. Check original context.'),
('widely_distributed', 'Content found at 10+ locations', 'HIGH', 'Viral content or potential misinformation. Verify original context and date.'),
('stock_photo_detected', 'Content matches known stock photo databases', 'MEDIUM', 'May be misrepresented as original or personal content.');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tos_verification_reports_timestamp ON tos_verification_reports(timestamp);
CREATE INDEX IF NOT EXISTS idx_tos_verification_reports_verdict ON tos_verification_reports(overall_verdict);
CREATE INDEX IF NOT EXISTS idx_tos_verification_reports_risk ON tos_verification_reports(risk_level);
CREATE INDEX IF NOT EXISTS idx_tos_ai_detection_stats_date ON tos_ai_detection_stats(date);
CREATE INDEX IF NOT EXISTS idx_tos_safety_scan_stats_date ON tos_safety_scan_stats(date);

-- Views for transparency and education
CREATE OR REPLACE VIEW tos_verification_transparency AS
SELECT
    DATE(timestamp) as analysis_date,
    input_type,
    overall_verdict,
    risk_level,
    COUNT(*) as analysis_count
FROM tos_verification_reports
GROUP BY DATE(timestamp), input_type, overall_verdict, risk_level
ORDER BY analysis_date DESC;

CREATE OR REPLACE VIEW tos_daily_verification_summary AS
SELECT
    DATE(timestamp) as date,
    COUNT(*) as total_verifications,
    COUNT(CASE WHEN risk_level = 'HIGH' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN risk_level = 'MEDIUM' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN risk_level = 'LOW' THEN 1 END) as low_risk_count,
    COUNT(CASE WHEN overall_verdict LIKE '%AI_GENERATED%' THEN 1 END) as ai_detected_count
FROM tos_verification_reports
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Function to update ToS Salad daily stats (privacy-preserving)
CREATE OR REPLACE FUNCTION update_tos_verification_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update ToS AI detection stats
    INSERT INTO tos_ai_detection_stats (date, total_analyses, ai_generated_count, likely_authentic_count, analysis_failed_count)
    VALUES (CURRENT_DATE, 1,
        CASE WHEN NEW.overall_verdict LIKE '%AI_GENERATED%' THEN 1 ELSE 0 END,
        CASE WHEN NEW.overall_verdict = 'ANALYSIS_COMPLETE' AND NEW.risk_level = 'LOW' THEN 1 ELSE 0 END,
        CASE WHEN NEW.overall_verdict = 'ANALYSIS_INCOMPLETE' THEN 1 ELSE 0 END)
    ON CONFLICT (date) DO UPDATE SET
        total_analyses = tos_ai_detection_stats.total_analyses + 1,
        ai_generated_count = tos_ai_detection_stats.ai_generated_count +
            CASE WHEN NEW.overall_verdict LIKE '%AI_GENERATED%' THEN 1 ELSE 0 END,
        likely_authentic_count = tos_ai_detection_stats.likely_authentic_count +
            CASE WHEN NEW.overall_verdict = 'ANALYSIS_COMPLETE' AND NEW.risk_level = 'LOW' THEN 1 ELSE 0 END,
        analysis_failed_count = tos_ai_detection_stats.analysis_failed_count +
            CASE WHEN NEW.overall_verdict = 'ANALYSIS_INCOMPLETE' THEN 1 ELSE 0 END;

    -- Update ToS safety scan stats
    INSERT INTO tos_safety_scan_stats (date, total_scans, threats_detected, safe_results, url_scans, file_scans)
    VALUES (CURRENT_DATE, 1,
        CASE WHEN NEW.overall_verdict = 'SECURITY_RISK_DETECTED' THEN 1 ELSE 0 END,
        CASE WHEN NEW.risk_level = 'LOW' THEN 1 ELSE 0 END,
        CASE WHEN NEW.input_type = 'url' THEN 1 ELSE 0 END,
        CASE WHEN NEW.input_type = 'file' THEN 1 ELSE 0 END)
    ON CONFLICT (date) DO UPDATE SET
        total_scans = tos_safety_scan_stats.total_scans + 1,
        threats_detected = tos_safety_scan_stats.threats_detected +
            CASE WHEN NEW.overall_verdict = 'SECURITY_RISK_DETECTED' THEN 1 ELSE 0 END,
        safe_results = tos_safety_scan_stats.safe_results +
            CASE WHEN NEW.risk_level = 'LOW' THEN 1 ELSE 0 END,
        url_scans = tos_safety_scan_stats.url_scans +
            CASE WHEN NEW.input_type = 'url' THEN 1 ELSE 0 END,
        file_scans = tos_safety_scan_stats.file_scans +
            CASE WHEN NEW.input_type = 'file' THEN 1 ELSE 0 END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stats updates
DROP TRIGGER IF EXISTS tos_verification_stats_trigger ON tos_verification_reports;
CREATE TRIGGER tos_verification_stats_trigger
    AFTER INSERT ON tos_verification_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_tos_verification_stats();

-- Comments for documentation
COMMENT ON TABLE tos_verification_reports IS 'ToS Salad: Privacy-compliant storage of content verification results. No sensitive user data stored.';
COMMENT ON TABLE tos_ai_detection_stats IS 'ToS Salad: Aggregated daily statistics for AI detection analysis. Used for transparency and improvement.';
COMMENT ON TABLE tos_safety_scan_stats IS 'ToS Salad: Aggregated daily statistics for security scanning. Helps track threat patterns.';
COMMENT ON TABLE tos_provenance_patterns IS 'ToS Salad: Educational reference data for understanding digital provenance patterns.';
COMMENT ON VIEW tos_verification_transparency IS 'ToS Salad: Public transparency view showing aggregated verification patterns.';
COMMENT ON VIEW tos_daily_verification_summary IS 'ToS Salad: Daily summary of verification activities for transparency reporting.';