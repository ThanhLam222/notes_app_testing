const baseData = (unique) => {

   return { name: "user",
    email: `user${unique}@gmail.com`,
    password: "user1",
    "confirm password": "user1", 
   }
}


export function createData (overrides = {}, testID = "noID", options = {testUI: true}) {
    const workerID = process.env.TEST_WORKER_INDEX ?? 0;
    /**
     * Using only Date.now() can cause duplicates when multiple tests or workers run at the same millisecond.
     * Adding workerID ensures uniqueness across workers, but tests inside the same worker can still collide.
     * Including testID separates data between tests, yet reruns of the same test may reuse the same email.
     * Therefore, add a random value to guarantee a fully unique email across all runs.
     */
    const unique = options.testUI ? `${Date.now()}_${Math.floor(Math.random() * 1e6)}_${testID}_${workerID}` : "fixed";
    const data = {...baseData(unique), ...overrides};

    if(!options.testUI) {
        data["confirm_password"] = data["confirm password"];
        delete data["confirm password"];
    }

    return data;
}
