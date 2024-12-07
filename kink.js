class kink{
    constructor(structure){
        //{independent} // {dynamic}
        this.type = structure.Dynamic === true?"Dynamic":"Dependent";
        this.handler = this.type === "Dynamic"? new dynamic(structure):new dependent(structure);

        this.count = 0;
    }

    static parser(str){

        let arr = str.split("");


        arr.forEach((item, index)=>{

            if(item === "-"){
                arr.splice(index, 1, "+");
                let alt = arr[index+1];
                arr.splice(index+1, 1, alt * -1);// [a, - , b] => [a, +, -b]
            }
        })

        arr.forEach((item, index)=>{
            if(item === "%"){

                let alt = Number(arr[index-1]) / Number(arr[index+1]);
                arr.splice(index-1, 3, null, alt); //0 and alt in order to preserve index sequence
            }
        })
        arr = arr.filter(item => item != null)

        arr.forEach((item, index)=>{
            if(item === "x"){

                let alt = Number(arr[index-1]) * Number(arr[index+1]);
                arr.splice(index-1, 3, null, alt); //0 and alt in order to preserve index sequence
            }
        })
        arr = arr.filter(item => item != null)

        arr.forEach((item, index)=>{
            if(item === "+"){

                let alt = Number(arr[index-1]) + Number(arr[index+1]);
                arr.splice(index-1, 3, null, alt); //0 and alt in order to preserve index sequence
            }

        })
        arr = arr.filter(item => item != null)

        arr = arr.join()
        console.log(arr);
    }
}



//different endpoints used
class dynamic{
    constructor(struct) {
        this.struct = struct;

        this.middleware = (res) => {
            if (!res.ok) throw new Error("kink faced an issue, please revise your code");
        }
    }

    async get(url, info={JSON_:true,  msg: true}){
        this.res = await fetch(url)
        this.#evaluate(this.res)
        if(info.msg === true){
            console.log(`GET req at ${url} made`)
        }

        return info.type === "json"? await this.res.json(): this.res;

    }

    async post(url,data ,info={type:"json" ,msg: true}){
        this.res = await fetch(url, {
            method: "POST",
            body: info.type==="json"?JSON.stringify(data): data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if(info.msg === true){
            console.log(`POST req at ${url} made`)
        }

        return info.type === "json"? await this.res.json(): this.res;
    }

    async put(url,data ,info={type:"json" ,msg: true}){
        this.res = await fetch(url, {
            method: "PUT",
            body: info.type==="json"?JSON.stringify(data): data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if(info.msg === true){
            console.log(`PUT req at ${url} made`)
        }

        return info.type === "json"? await this.res.json(): this.res;
    }

    async delete(url,data ,info={type:"json" ,msg: true}){
        this.res = await fetch(url, {
            method: "DELETE",
            body: info.type==="json"?JSON.stringify(data): data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if(info.msg === true){
            console.log(`DELETE req at ${url} made`)
        }

        return info.type === "json"? await this.res.json(): this.res;
    }

    #evaluate(res) {
        this.middleware(res);
    }
}

//singular common endpoint used
class dependent {
    constructor(structure) {
        if (!structure.url) {
            throw new Error("Base url not found")
        }
        this.struct = structure;
        this.middleware = (res) => {
            if (!res.ok) throw new Error("kink faced an issue, please revise your code");
        }
    }

    async get(info = {JSON_: true, msg: true}, url = this.struct.url) {
        this.res = await fetch(url)
        this.#evaluate(this.res)
        if (info.msg === true) {
            console.log(`GET req at ${url} made`)
        }

        return info.type === "json" ? await this.res.json() : this.res;

    }

    async post(data, info = {type: "json", msg: true}, url = this.struct.url) {
        this.res = await fetch(url, {
            method: "POST",
            body: info.type === "json" ? JSON.stringify(data) : data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if (info.msg === true) {
            console.log(`POST req at ${url} made`)
        }

        return info.type === "json" ? await this.res.json() : this.res;
    }

    async put(data, info = {type: "json", msg: true}, url = this.struct.url) {
        this.res = await fetch(url, {
            method: "PUT",
            body: info.type === "json" ? JSON.stringify(data) : data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if (info.msg === true) {
            console.log(`PUT req at ${url} made`)
        }

        return info.type === "json" ? await this.res.json() : this.res;
    }

    async delete(data, info = {type: "json", msg: true}, url = this.struct.url) {
        this.res = await fetch(url, {
            method: "DELETE",
            body: info.type === "json" ? JSON.stringify(data) : data,
            headers: {"Content-Type": `application/${info.type}`},
        })
        this.#evaluate(this.res)
        if (info.msg === true) {
            console.log(`DELETE req at ${url} made`)
        }

        return info.type === "json" ? await this.res.json() : this.res;
    }

    #evaluate(res) {
        this.middleware(res);
    }
}


async function test(){
    const req = new kink({Dynamic: false, url: "https://jsonplaceholder.typicode.com/users"}).handler;
    req.middleware = (res) =>{
        if(res.statusText === "OK"){
            console.log("test passed")
        }
    }
    let data = await req.get();
}

kink.parser("1-1+2x2%2");
