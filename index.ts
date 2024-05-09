// index.ts

console.log('232')

async function fetchData(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['data1', 'data2', 'data3']);
    }, 2000);
  });
}

async function main() {
  console.log('Fetching data...');
  const data = await fetchData();
  console.log('Data:', data);
  console.log('Program finished');
}

main();

// ts-node-dev --inspect=9230 --respawn --debug ./src/index.ts

// "ts-node-dev --respawn --transpileOnly ./index.ts"