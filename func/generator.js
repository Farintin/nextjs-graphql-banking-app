function generateAccNo() {
    return Math.floor(Math.random(0,10) * 100000000000).toString()
}



export default { generateAccNo }