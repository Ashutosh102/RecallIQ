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
  console.log('\n🔑 Razorpay Environment Setup Script 🔑\n');
  console.log('This script will help you set up the necessary environment variables for Razorpay integration.');
  
  // Get Razorpay API keys
  console.log('\n📝 Please enter your Razorpay API keys:');
  const keyId = await prompt('Razorpay Key ID: ');
  const keySecret = await prompt('Razorpay Key Secret: ');
  
  // Set Supabase secrets
  console.log('\n🔧 Setting up Supabase secrets...');
  try {
    console.log('Setting RAZORPAY_KEY_ID...');
    execSync(`supabase secrets set RAZORPAY_KEY_ID=${keyId}`);
    
    console.log('Setting RAZORPAY_KEY_SECRET...');
    execSync(`supabase secrets set RAZORPAY_KEY_SECRET=${keySecret}`);
    
    console.log('✅ Supabase secrets set successfully!');
  } catch (error) {
    console.error('❌ Error setting Supabase secrets:', error.message);
    console.log('Make sure you have the Supabase CLI installed and are logged in.');
  }
  
  // Create/update .env file
  console.log('\n🔧 Updating .env file...');
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    // Read existing .env if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Check if VITE_RAZORPAY_KEY_ID already exists
    if (!envContent.includes('VITE_RAZORPAY_KEY_ID=')) {
      envContent += `\nVITE_RAZORPAY_KEY_ID=${keyId}\n`;
    } else {
      // Replace existing value
      envContent = envContent.replace(
        /VITE_RAZORPAY_KEY_ID=.*/,
        `VITE_RAZORPAY_KEY_ID=${keyId}`
      );
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }
  
  console.log('\n🎉 Setup complete! 🎉');
  console.log('\nNext steps:');
  console.log('1. Deploy the Supabase Edge Functions:');
  console.log('   $ supabase functions deploy create-razorpay-order');
  console.log('   $ supabase functions deploy verify-razorpay-payment');
  console.log('2. Apply the database migration:');
  console.log('   $ supabase db push');
  console.log('\nFor more information, see RAZORPAY_SETUP.md');
  
  rl.close();
}

main();