
export function calcular(operation, n1, n2) {

    switch (operation) {

        case '+':
            return n1 + n2          
        case '-':
            return n1 - n2 
        case '/':
            return n1 / n2 
        case '*':
            return n1 * n2            

        default:
            break;
    }
}

export function porcentagem(operation, n1, n2) {

    let porcento = (n1 * n2) / 100;
    let total = 0;        
    
    if(operation === '+'){
        total = n1 + porcento; 
    }else if (operation === '-'){
        total = n1 - porcento;   
    }else if (operation === '*'){
        total = n1 * porcento;
    }else if (operation === '/'){
        total = n1 / porcento;
    }
    
    console.log(`operation: ${operation} porcento: ${porcento}`)
    console.log(`n1: ${n1} n2: ${n2} total: ${total}`)

    return total
}
