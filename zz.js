const panjang = 10
const tinggi = 10

for (let i = 0; i < tinggi; i++) {
    let cetak = ""
    for (let j = 0; j < panjang; j++) {
        if(j == 0 || i == 0 || j == panjang - 1 || i == tinggi - 1){
            cetak += "*"
        }
        else cetak += " "

        // const element = array[j];

        
    }
    console.log(cetak);
    // const element = array[index];
    
}