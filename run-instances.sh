#!/bin/bash

# RUNBY Multiple Instances Script
# This script runs multiple instances of the RUNBY app on different ports

echo "🚀 Starting RUNBY Multiple Instances..."

# Kill any existing Next.js processes
echo "🛑 Stopping existing instances..."
pkill -f "next dev" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Create logs directory if it doesn't exist
mkdir -p logs

# Start Instance 1 (Port 4000)
echo "📱 Starting Instance 1 on port 4000..."
PORT=4000 npm run dev -- -H 0.0.0.0 -p 4000 > logs/instance-4000.log 2>&1 &
INSTANCE1_PID=$!

# Wait a moment before starting the second instance
sleep 3

# Start Instance 2 (Port 4001)
echo "📱 Starting Instance 2 on port 4001..."
PORT=4001 npm run dev -- -H 0.0.0.0 -p 4001 > logs/instance-4001.log 2>&1 &
INSTANCE2_PID=$!

# Wait for instances to start
echo "⏳ Waiting for instances to start..."
sleep 15

# Check if instances are running
echo "🔍 Checking instance status..."

if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo "✅ Instance 1 (Port 4000): RUNNING"
    echo "   🌐 URL: http://localhost:4000"
else
    echo "❌ Instance 1 (Port 4000): FAILED"
fi

if curl -s http://localhost:4001 > /dev/null 2>&1; then
    echo "✅ Instance 2 (Port 4001): RUNNING"
    echo "   🌐 URL: http://localhost:4001"
else
    echo "❌ Instance 2 (Port 4001): FAILED"
fi

echo ""
echo "🎉 Multiple instances started!"
echo "📊 Process IDs:"
echo "   Instance 1: $INSTANCE1_PID"
echo "   Instance 2: $INSTANCE2_PID"
echo ""
echo "📝 Logs available in:"
echo "   Instance 1: logs/instance-4000.log"
echo "   Instance 2: logs/instance-4001.log"
echo ""
echo "🛑 To stop all instances, run: pkill -f 'next dev'"
echo "🔍 To check status, run: ps aux | grep 'next dev'"
