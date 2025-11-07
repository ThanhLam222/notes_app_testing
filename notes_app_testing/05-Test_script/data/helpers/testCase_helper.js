export function makeTestCase(createData) {
    return (options = {}) => {
        const {name, nameCreate, nameUpdate, agrs = []} = options;
        return {
            ...(name ? {name} : {}),
            ...(nameCreate ? {nameCreate} : {}),
            ...(nameUpdate ? {nameUpdate} : {}),
            data: createData(...agrs),
        }
    }
}