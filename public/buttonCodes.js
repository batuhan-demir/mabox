const sil = async(path) => {

    const result = await (await fetch('/dosyalar?path=' + path,{
        method: 'DELETE'
    })).text();

    console.log(result);

    window.location.reload();
}

const yenidenAdlandir = async(path, newName) => {
    
}


const yeniKlasor = async() => {

    const dirName = prompt("Klasör Adı", "");

    const result = await (await fetch('/yeniKlasor?path=' + dirName)).text();

    console.log(result);

    window.location.reload();


}