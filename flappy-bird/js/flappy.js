/*
            *************************************
            *            FLAPPY BIRD            * 
            *                                   *
            *  Author: h1s0k4                   *
            *  Curso: Cod3r - Web Moderno       *
            *************************************
*/

//#region novoElemento
function novoElemento(tagName, className){
    const element = document.createElement(tagName)
    element.className = className
    return element
}
//#endregion

//#region BarreiraFactory
function BarreiraFactory(reversa = false){
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo: borda)
    this.elemento.appendChild(reversa ? borda: corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}
//#endregion

//#region ParDeBarreiraFactory
function ParDeBarreiraFactory(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new BarreiraFactory(true)
    this.inferior = new BarreiraFactory(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}
//#endregion

//#region BarreirasFactory
function BarreirasFactory(altura, largura, abertura, espaco, notificarPonto){

    this.pares = [
        new ParDeBarreiraFactory(altura, abertura, largura),
        new ParDeBarreiraFactory(altura, abertura, largura + espaco),
        new ParDeBarreiraFactory(altura, abertura, largura + espaco * 2),
        new ParDeBarreiraFactory(altura, abertura, largura + espaco * 3)
    ]

    // Velocidade do Deslocamento
    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // Quando o elemento sair da área do jogo
            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio

            if(cruzouOMeio)
                notificarPonto()
        })
    }
}
//#endregion

//#region Passaro
function Passaro(alturaJogo){
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if(novoY <= 0)
            this.setY(0)
        else if (novoY >= alturaMaxima)
            setY(alturaMaxima)
        else    
            this.setY(novoY)
    }

    this.setY(alturaJogo / 2)
}
//#endregion

//#region Progresso
function Progresso(){
    this.elemento = novoElemento('span', 'progresso')

    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}
//#endregion

//#region Colisão

//#region estaoSobrepostos
function estaoSobrepostos(elementoA, elementoB){

    const a = elementoA.getBoundingClientRect() //-> Barreiras
    const b = elementoB.getBoundingClientRect() //-> Passaro

    //#region Variaveis
    const ladoDireitoA = a.left + a.width
    const ladoEsquerdoB = b.left
    const ladoDireitoB = b.left + b.width
    const ladoEsquerdoA = a.left

    const parteDeBaixoA = a.top + a.height
    const topoB = b.top
    const parteDeBaixoB = b.top + b.height
    const topoA = a.top
    //#endregion

    // SENTIDO HORIZONTAL - Quando o lado direito de (A) é maior que o lado esquerdo de (B) -> houve colisão
    // SENTIDO HORIZONTAL - Quando o lado direito de (B) é maior que o lado esquerdo de (A) -> houve colisão
    const horizontal = ladoDireitoA >= ladoEsquerdoB && ladoDireitoB >= ladoEsquerdoA

    // SENTIDO VERTICAL - Quando a parte de baixo de (A) for maior que o topo de (B) -> houve colisão
    // SENTIDO VERTICAL - Quando a parte de baixo de (B) for maior que o topo de (A) -> houve colisão
    const vertical = parteDeBaixoA >= topoB && parteDeBaixoB >= topoA

    return horizontal && vertical
}
//#endregion

//#region colidiu 
function colidiu(passaro, barreiras){

    let colidiu = false

    barreiras.pares.forEach(parDeBarreiras => {

        if(!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento

            colidiu = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior)
        }
    })

    return colidiu
}
//#endregion

//#endregion

//#region FlappyBird
function FlappyBird(){

    //#region Criando Elementos
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth
    const progresso = new Progresso()
    const barreiras = new BarreirasFactory(altura, largura, 200, 400, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)
    const texto = this.elemento = novoElemento('div', 'reiniciar')
    //#endregion
    
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        //LOOP do Jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro, barreiras)){
                clearInterval(temporizador)                
            }

        }, 20)
    }
}
//#endregion


new FlappyBird().start()