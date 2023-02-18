const localstore = {
    saveObj: (item, ary) => {
        return localStorage.setItem(item, JSON.stringify(ary));
    },

    getObj: (item) => {
        return JSON.parse(localStorage.getItem(item));
    }
}

export default localstore;