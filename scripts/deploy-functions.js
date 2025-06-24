#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function
async function main() {
  console.log('\n🚀 Supabase Functions Deployment Helper 🚀\n');
  console.log('This script will help you deploy Supabase Edge Functions without Docker.');
  
  // Check if npx is available
  try {
    execSync('npx --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ npx is not available. Please install Node.js and npm.');
    process.exit(1);
  }
  
  // Check if Supabase CLI is installed
  try {
    execSync('npx supabase --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('⚠️ Supabase CLI not found. Installing...');
    try {
      execSync('npm install -g supabase', { stdio: 'inherit' });
    } catch (installError) {
      console.error('❌ Failed to install Supabase CLI globally.');
      console.log('Trying to use local installation...');
    }
  }
  
  // Login to Supabase
  console.log('\n🔑 Logging in to Supabase...');
  try {
    execSync('npx supabase login', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to login to Supabase.');
    process.exit(1);
  }
  
  // Get project reference
  let projectRef;
  try {
    // Try to read from .temp/project-ref file
    const projectRefPath = path.join(process.cwd(), 'supabase', '.temp', 'project-ref');
    if (fs.existsSync(projectRefPath)) {
      projectRef = fs.readFileSync(projectRefPath, 'utf8').trim();
      console.log(`📋 Found project reference: ${projectRef}`);
    }
  } catch (error) {
    // Ignore error
  }
  
  if (!projectRef) {
    projectRef = await prompt('Enter your Supabase project reference: ');
  }
  
  // Link project
  console.log(`\n🔗 Linking to project ${projectRef}...`);
  try {
    execSync(`npx supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to link project.');
    process.exit(1);
  }
  
  // Set Razorpay environment variables
  console.log('\n🔧 Setting up Razorpay environment variables...');
  const keyId = await prompt('Enter your Razorpay Key ID: ');
  const keySecret = await prompt('Enter your Razorpay Key Secret: ');
  
  try {
    console.log('Setting RAZORPAY_KEY_ID...');
    execSync(`npx supabase secrets set RAZORPAY_KEY_ID=${keyId}`, { stdio: 'inherit' });
    
    console.log('Setting RAZORPAY_KEY_SECRET...');
    execSync(`npx supabase secrets set RAZORPAY_KEY_SECRET=${keySecret}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to set secrets. Continuing anyway...');
  }
  
  // Deploy functions
  console.log('\n🚀 Deploying functions...');
  
  const functions = [
    'create-razorpay-order',
    'verify-razorpay-payment'
  ];
  
  for (const func of functions) {
    console.log(`\nDeploying ${func}...`);
    try {
      execSync(`npx supabase functions deploy ${func} --no-verify-jwt`, { stdio: 'inherit' });
      console.log(`✅ Successfully deployed ${func}`);
    } catch (error) {
      console.error(`❌ Failed to deploy ${func}.`);
    }
  }
  
  console.log('\n🎉 Deployment process completed! 🎉');
  console.log('\nNext steps:');
  console.log('1. Apply the database migration:');
  console.log('   $ npx supabase db push');
  console.log('2. Update your .env file with:');
  console.log(`   VITE_RAZORPAY_KEY_ID=${keyId}`);
  console.log('\nFor more information, see RAZORPAY_SETUP.md');
  
  rl.close();
}

main();