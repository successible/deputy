export NEXT_PUBLIC_VERSION=$(git rev-parse --short HEAD)
npx next build
node create-service-worker.js
echo $NEXT_PUBLIC_VERSION > out/version.txt