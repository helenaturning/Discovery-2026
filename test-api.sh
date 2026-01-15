#!/bin/bash

# Configuration
API_URL="http://localhost:5000/api"
EMAIL="test@example.com"
PASSWORD="password123"

echo "--- 🚀 Starting Backend API Tests ---"

# 1. Health Check
echo -e "\n1. Checking Health..."
curl -s "$API_URL/health" | grep -q "ok" && echo "✅ Health OK" || echo "❌ Health Check Failed"

# 2. Registration
echo -e "\n2. Testing Registration..."
REG_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"employeeId\": \"TEST001\",
    \"company\": \"TestCorp\",
    \"role\": \"admin\"
  }")

if echo "$REG_RESPONSE" | grep -q "token"; then
  echo "✅ Registration Successful"
else
  # Check if user already exists
  if echo "$REG_RESPONSE" | grep -q "User already exists"; then
    echo "ℹ️ User already exists, proceeding to login..."
  else
    echo "❌ Registration Failed: $REG_RESPONSE"
  fi
fi

# 3. Login
echo -e "\n3. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -oP '"token":"\K[^"]+')

if [ -n "$TOKEN" ]; then
  echo "✅ Login Successful. Token obtained."
else
  echo "❌ Login Failed: $LOGIN_RESPONSE"
  exit 1
fi

# 4. Create a Site (Admin Only)
echo -e "\n4. Testing Site Creation..."
SITE_RESPONSE=$(curl -s -X POST "$API_URL/sites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Test Site\",
    \"address\": \"789 Test Lane\",
    \"city\": \"Testville\",
    \"latitude\": 45.0,
    \"longitude\": 5.0,
    \"radius\": 200
  }")

if echo "$SITE_RESPONSE" | grep -q "Test Site"; then
  echo "✅ Site Creation Successful"
  SITE_ID=$(echo "$SITE_RESPONSE" | grep -oP '"id":"\K[^"]+')
else
  echo "❌ Site Creation Failed: $SITE_RESPONSE"
fi

# 5. Fetch Sites
echo -e "\n5. Testing Site Retrieval..."
SITES_LIST=$(curl -s -X GET "$API_URL/sites" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SITES_LIST" | grep -q "Test Site"; then
  echo "✅ Site Retrieval Successful"
else
  echo "❌ Site Retrieval Failed: $SITES_LIST"
fi

echo -e "\n--- ✨ Tests Completed ---"
