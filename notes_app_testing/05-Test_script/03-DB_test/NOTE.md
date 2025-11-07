### NOTE FOR TEST DATABASE:
1. This test use the **same jest runner and configuration file (`jest.config.mjs`)** as the API test.
2. It also shares the **same Mongoose setup utilities** (connection, teardown, and memory server) with the API test suite.
3. Only the note-related test data and sign in data (for test session database) are reused from the API test suite.
   The user-related test data is **not** reused and is defined separately for this test suite.


