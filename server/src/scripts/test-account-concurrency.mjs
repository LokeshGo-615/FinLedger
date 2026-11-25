const API_URL = "http://localhost:5000/api/v1";

const token = process.env.TEST_ACCESS_TOKEN;

if (!token) {
  throw new Error("Access token required");
}

async function createAccount() {
  const response = await fetch(`${API_URL}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountType: "SAVINGS",
    }),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
}

const results = await Promise.all(
  Array.from({ length: 10 }, () => createAccount())
);

const successful = results.filter(
  (result) => result.status === 201
).length;

const rejected = results.filter(
  (result) => result.status === 409
).length;

console.table(
  results.map((result, index) => ({
    request: index + 1,
    status: result.status,
    message: result.data.message,
  }))
);

console.log("Successful creations:", successful);
console.log("Rejected requests:", rejected);

if (successful === 5 && rejected === 5) {
  console.log("CONCURRENCY TEST PASSED");
} else {
  console.error("CONCURRENCY TEST FAILED");
  process.exitCode = 1;
}