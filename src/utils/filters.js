export function buildFilters(params) {
    return new Promise((resolve, reject) => {
        try {
            const order = params.sort && params.sort.value && params.sort.value.split("|") || ["createdAt", "DESC"];

            let findConditions = {
                limit: params.limit && params.limit.value || 1000,
                offset: params.start && params.start.value || 0,
                order: [[order[0], order[1] || 'ASC']],
                where: {}
            };

            if (params.filters && params.filters.value) {
                let conditions = JSON.parse(params.filters.value);

                for (let key in conditions) {
                    if (conditions.hasOwnProperty(key)) {
                        let [value, operator] = conditions[key].split("|");
                        operator = '$' + (operator || 'eq');

                        //TODO : list all allowed parameters
                        switch (operator) {
                            case 'eq':
                                findConditions.where[key] = value;
                                break;
                            default:
                                const clause = {};
                                clause[operator] = value;
                                findConditions.where[key] = clause;
                                break;
                        }
                    }
                }
            }

            resolve(findConditions);
        }
        catch (e) {
            reject(e);
        }
    });
}


export default {buildFilters}