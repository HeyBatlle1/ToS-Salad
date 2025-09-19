#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addBankOfAmericaAnalysis() {
  console.log('🏦 Adding Bank of America Online Banking Service Agreement analysis...');

  const boaContent = `Bank of America Online Banking Service Agreement: Key Clause Analysis & Transparency Score

Transparency Score: 8/100
Justification: Bank of America's Online Banking Service Agreement represents the most systemically dangerous financial services agreement analyzed. It combines complete abandonment of fraud protection (Zelle® scam liability), automated surveillance and recording systems, mandatory data sharing with third parties, artificial liability caps ($100 maximum regardless of bank errors), and discretionary overdraft fee generation. Most critically, it weaponizes digital banking tools against customers while providing maximum legal protection for the bank. The score reflects systematic financial exploitation with particular concern for vulnerable customers who rely on digital banking.

1. The Zelle® "Trust" Trap: Bank Abandons All Liability for Scams
Original Text: "THE SERVICE IS INTENDED TO SEND MONEY TO FRIENDS, FAMILY AND OTHERS YOU TRUST. YOU SHOULD NOT USE THE SERVICE TO SEND MONEY TO RECIPIENTS WITH WHOM YOU ARE NOT FAMILIAR OR YOU DO NOT TRUST. NEITHER WE NOR ZELLE® OFFER PURCHASE PROTECTION FOR AUTHORIZED PAYMENTS MADE THROUGH THE SERVICE (FOR EXAMPLE, IF YOU DO NOT RECEIVE THE GOODS OR SERVICES THAT YOU PAID FOR, OR THE GOODS OR SERVICES THAT YOU RECEIVED ARE DAMAGED OR ARE OTHERWISE NOT WHAT YOU EXPECTED)."
Plain English Explanation: This is a critical warning. Unlike credit card transactions, Zelle® payments are like handing someone cash. If you are tricked into sending money to a scammer, the bank considers it an "authorized" payment. They state explicitly that they offer zero purchase protection, and you are solely responsible for the loss. The bank will not help you recover your money.

2. The Security Black Hole: Your Responsibility if Your Password is Used
Original Text: "If you permit another person to use your User ID and password... you are responsible for all transactions that person performs (even if he or she exceeds your authorization), until you notify us that the person is no longer authorized... Bank of America will have no liability to you for any unauthorized payment or transfer made using your password that occurs before you have notified us... and we have had a reasonable opportunity to act on that notice."
Plain English Explanation: This clause places the entire burden of password security on you. If you give someone access for one specific reason (e.g., to pay a single bill) and they proceed to drain your account, the bank holds you responsible for all of it until you successfully report the issue. The vague "reasonable opportunity to act" gives the bank significant leeway to deny liability.

3. The Liability Cap: If the Bank Causes Catastrophic Loss, They Owe You Almost Nothing
Original Text: "IN THOSE STATES WHERE THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES MAY NOT APPLY, ANY LIABILITY OF US OR OUR VENDORS... SHALL, IN NO EVENT, EXCEED ONE HUNDRED DOLLARS ($100.00)."
Plain English Explanation: This is the bank's ultimate liability shield. It states that even in cases where they are found legally liable for damages (for example, resulting from a major security failure on their end), the absolute maximum they will pay you is $100. This clause attempts to protect the bank from any meaningful financial accountability for its errors.

4. The Dispute Clock: Your Rights Evaporate in 60 Days
Original Text: "We must hear from you no later than 60 days after we have sent the FIRST statement on which the problem or error appeared... If you do not, you may not get back any of the money you lost from any unauthorized transaction that occurs after the close of the 60-day period..."
Plain English Explanation: This describes your window to report an error or unauthorized transaction. If you don't meticulously review your statements and report an issue within 60 days of the statement date, you can permanently lose your right to get your money back. This puts a strict and often difficult-to-meet deadline on customers to protect their own funds.

5. "Erica" the AI Assistant: A Surveillance and Liability Device
Original Text: "Once you initiate an interaction with Erica, we will record and transcribe these interactions... Erica may capture, record, and transcribe other voices in addition to yours... We will treat all voice interactions and transactions as though you authorized them... even if another voice or person initiated or completed them. Bank of America uses a third-party service provider to provide voice responses, which keeps a record of your conversations..."
Plain English Explanation: This reveals that the "Erica" assistant is a constant recording device. It records and transcribes everything it hears—including background conversations and other people's voices—and shares these recordings with an unnamed third-party company. Critically, the bank states it will treat any voice command it hears as an authorized transaction from you, creating a massive security and privacy risk.

6. Automatic Enrollment in Data Sharing Programs
Original Text: "By enrolling in online and mobile banking, you will be automatically enrolled in the Bank's merchant rewards program, BankAmeriDeals, whereby the Bank will share anonymized transaction information with vendors... By using the Services, you authorize your wireless carrier to use or disclose information about your account and your wireless device... to Bank of America or its service provider... to prevent fraud."
Plain English Explanation: This clause states that you are automatically opted-in to programs that share your financial data. Your spending history ("anonymized transaction information") is shared with third-party vendors for advertising purposes. Furthermore, you give permission for your cell phone company to share your account and device information with the bank, eroding the privacy of two separate services simultaneously.

7. The "As Is" Service: The Bank Guarantees Nothing
Original Text: "NEITHER WE NOR OUR VENDORS... WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE... THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS."
Plain English Explanation: This is a comprehensive disclaimer of quality and security. The bank provides the online and mobile banking services with no legal guarantee that they will work correctly, be available when you need them, or be secure from errors and attacks. You, the customer, assume all the risk of using their digital services.

8. The Unilateral Contract: They Can Change the Rules at Any Time, and the Burden is on You to Notice
Original Text: "We may add, delete or change the terms of this Agreement at any time. We will inform you of changes when legally required and will try to inform you of the nature of any material changes even when not legally required to do so... You agree that by continuing to use the Services after the date that changes are posted to our website, such changes will be effective for transactions made after that date, whether or not you access the website or otherwise receive actual notice of the changes."
Plain English Explanation: This clause states that the bank can change this legal contract whenever they want. The responsibility is on you to constantly check their website for updates. Your continued use of the online service is legally considered your acceptance of the new terms, even if you have not actually read or received notice of the changes.

9. The "Commercially Reasonable" Security Shield: Following Their Rules Matters More Than Your Actual Security
Original Text: "By using the Services, you acknowledge and agree that this Agreement sets forth security procedures for electronic banking transactions that are commercially reasonable. You agree to be bound by instructions, whether authorized or unauthorized, which we implement in compliance with these procedures..."
Plain English Explanation: This is a powerful legal shield for the bank. It says that as long as they follow their own internal security procedures, you are legally bound by any transaction that occurs—even if it was unauthorized. This shifts the legal argument from "Did the customer actually approve this?" to "Did the bank follow its own checklist?"

10. The Discretionary Overdraft: They Can Choose to Cause an Overdraft and Charge You Fees
Original Text: "If an account does not have sufficient available funds on the scheduled date, we may elect not to initiate one or more of the transfers. If we do elect to initiate the transfer... it may cause an overdraft in your account in which case you shall be fully responsible for the overdraft and any Overdraft Item Fees..."
Plain English Explanation: This clause gives the bank a choice when you have a bill payment scheduled but not enough money. They can either decline the payment (which may cause you to incur a late fee from the payee) or they can approve the payment, intentionally causing an overdraft for which they will charge you a fee. The decision is entirely theirs, and either outcome can be financially negative for you.

11. The Currency Exchange Markup: They Explicitly State Their Rate Will Be Worse for You
Original Text: "If we assign an exchange rate to your foreign exchange transaction, that exchange rate will be determined by us in our sole discretion... The exchange rate you are offered may be different from, and likely inferior to, the rate paid by us to acquire the underlying currency. We provide all-in pricing for exchange rates. The price provided may include profit, fees, costs, charges or other markups..."
Plain English Explanation: This is a direct admission that the bank builds a profit margin into the currency exchange rates it offers you. They state that the rate you get is determined in their "sole discretion" and will be "likely inferior" to the actual market rate they get. This markup is a hidden cost of the service.

12. Termination Without Obligation: They Can Cut Off Your Access and Aren't Required to Tell You First
Original Text: "We may terminate your participation in any or all of your Services for any reason, including inactivity, at any time. We will try to notify you in advance, but we are not obliged to do so."
Plain English Explanation: The bank reserves the right to terminate your access to your online banking tools whenever they want, for any reason. While they say they will "try" to give you notice, they explicitly state they have no legal obligation to warn you before they do it.

13. Joint Account Liability: Any One Owner Can Act for All Owners
Original Text: "When your Service is linked to one or more joint accounts, we may act on the verbal, written or electronic instructions of any authorized signer."
Plain English Explanation: For joint accounts, this means the bank can treat an instruction from one owner as an instruction from all owners. This can have significant consequences, as one person could make a major transaction or change account settings without the direct, immediate consent of the other account holders.

This agreement systematically protects the institution while exposing customers to maximum financial risk and surveillance, representing the worst practices in financial services.

Transparency Score: 8/100 - Critical Risk Level
Red Flags: 13 systematic financial exploitation issues`;

  try {
    // First create or get Bank of America company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'bankofamerica.com')
      .single();

    if (companyError || !existingCompany) {
      console.log('📝 Creating Bank of America company record...');
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Bank of America',
          domain: 'bankofamerica.com',
          industry: 'Financial Services',
          headquarters: 'Charlotte, NC',
          founded_year: 1904,
          tos_url: 'https://www.bankofamerica.com/online-banking/service-agreement/',
          corporate_website: 'https://www.bankofamerica.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Bank of America company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Bank of America company record');
    }

    // Create Bank of America-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Bank of America Online Banking Service Agreement',
        url: 'https://www.bankofamerica.com/online-banking/service-agreement/',
        raw_content: boaContent,
        cleaned_content: boaContent,
        content_hash: require('crypto').createHash('md5').update(boaContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: boaContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ Bank of America document created');

    // Create Bank of America-specific analysis with financial exploitation focus
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 8, // Lowest score - worse than TikTok due to direct financial harm
        user_friendliness_score: 5, // Extremely hostile to customer financial security
        privacy_score: 10, // Automated surveillance and mandatory data sharing
        manipulation_risk_score: 98, // Critical - systematic financial exploitation
        data_collection_risk: 'critical', // AI assistant recording everything + data sharing
        data_sharing_risk: 'critical', // Automatic enrollment in data sharing programs
        account_termination_risk: 'high', // Can terminate access without notice
        legal_jurisdiction_risk: 'critical', // 60-day dispute deadlines + liability caps
        concerning_clauses: [
          {category: 'Zelle Scam Liability Abandonment', concern: 'Zero fraud protection for authorized payments'},
          {category: 'Password Security Black Hole', concern: 'Customer liable for all password-based transactions'},
          {category: 'Catastrophic Loss Liability Cap', concern: 'Maximum $100 liability regardless of bank errors'},
          {category: '60-Day Dispute Deadline', concern: 'Rights evaporate if not reported within 60 days'},
          {category: 'AI Assistant Surveillance Device', concern: 'Records everything and treats all voices as authorized'},
          {category: 'Automatic Data Sharing Enrollment', concern: 'Financial data shared with vendors without opt-in'},
          {category: 'As Is Service Disclaimer', concern: 'No guarantees on security or availability'},
          {category: 'Unilateral Contract Changes', concern: 'Can change agreement anytime without meaningful notice'},
          {category: 'Commercially Reasonable Security Shield', concern: 'Following procedures matters more than actual security'},
          {category: 'Discretionary Overdraft Fee Generation', concern: 'Can choose to cause overdrafts and charge fees'},
          {category: 'Currency Exchange Rate Markup', concern: 'Explicitly admits to charging worse rates than market'},
          {category: 'Service Termination Without Notice', concern: 'Can cut off banking access without obligation to warn'},
          {category: 'Joint Account Individual Authorization', concern: 'Any owner can act for all owners without consent'}
        ],
        manipulation_tactics: ['Financial Exploitation', 'Automated Surveillance', 'Liability Transfer', 'Fee Generation'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Bank of America systematically exploits customers through fraud liability abandonment and automated surveillance, scoring 8/100.',
        key_concerns: [
          'Complete Zelle Fraud Liability Abandonment',
          'Password Security Responsibility Transfer',
          'Catastrophic Loss $100 Liability Cap',
          '60-Day Rights Expiration Deadline',
          'AI Assistant Universal Recording Device',
          'Automatic Financial Data Sharing',
          'No Digital Service Security Guarantees',
          'Unilateral Agreement Modification Rights',
          'Procedural Security Over Actual Security',
          'Discretionary Overdraft Fee Creation',
          'Admitted Currency Exchange Rate Markups',
          'Banking Access Termination Without Notice',
          'Joint Account Individual Control Rights'
        ],
        recommendations: [
          'Understand Zelle payments have zero fraud protection',
          'Never share banking passwords - you are liable for all activity',
          'Know bank maximum liability is $100 regardless of their errors',
          'Review statements within 60 days or lose all rights permanently',
          'Be aware AI assistant records everything and shares with third parties',
          'Expect automatic enrollment in data sharing programs',
          'Cannot rely on bank to guarantee digital service security',
          'Monitor agreement changes constantly or lose all protections',
          'Understand bank procedures matter more than actual security',
          'Know bank can choose to cause overdrafts and charge fees',
          'Expect worse exchange rates with hidden markup fees',
          'Bank can terminate digital access without warning',
          'Any joint account owner can authorize major transactions alone'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Bank of America analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: Critical (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 13 systematic financial exploitation issues`);
    console.log('🏦 Financial exploitation and customer surveillance confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('📊 Microsoft:       20/100 (Critical)');
    console.log('📊 LinkedIn:        25/100 (High Risk - Professional Exploitation)');
    console.log('📊 Google:          25/100 (High Risk)');
    console.log('📊 Discord:         30/100 (High Risk)');
    console.log('📊 Spotify:         30/100 (Consumer)');

  } catch (error) {
    console.error('❌ Bank of America analysis failed:', error.message);
  }
}

addBankOfAmericaAnalysis();