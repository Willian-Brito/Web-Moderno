import React, {Component} from 'react'
import './Calculator.css'

import Button from '../components/Button'
import Display from '../components/Display'
import {calcular, porcentagem} from '../utils/utils'

const initalState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values:[0, 0],
    current: 0
}

export default class Calculator extends Component{

    state = { ...initalState }

    constructor(props) {
        super(props)

        this.clearMemory = this.clearMemory.bind(this)
        this.setOperation = this.setOperation.bind(this)
        this.addDigit = this.addDigit.bind(this)
        this.fatorial = this.fatorial.bind(this)
        this.backspace = this.backspace.bind(this)        
    }

    clearMemory() {
        this.setState({...initalState})
    }

    setOperation(operation) {

        if(this.state.current === 0) {            
            this.setState({operation, current: 1, clearDisplay: true})
        } else {

            const finish = operation === '=' || '%'
            const currentOperation = this.state.operation
            const values = [...this.state.values]

            try {

                if (operation === '%') {
                    values[0] = porcentagem(currentOperation, values[0], values[1])
                } else {

                    // values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`)              
                    values[0] = calcular(currentOperation, values[0], values[1])
                    // values[1] = 0
                }

            } catch (e) {
                values[0] = this.state.values[0]
            }

            values[1] = 0

            this.setState({
                displayValue: values[0],
                operation: finish ? null : operation,
                current: finish ? 0 : 1,
                clearDisplay: !finish,
                values
            })

        }
    }

    addDigit(number) {

        if(number === '.' && this.state.displayValue.includes('.')) 
            return

        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay
        const currentValue = clearDisplay ? '' : this.state.displayValue
        const displayValue = currentValue + number

        this.setState({displayValue, clearDisplay: false})

        if(number !== '.') {
            const i = this.state.current

            const newValue = parseFloat(displayValue)
            const values = [...this.state.values]
            values[i] = newValue
            this.setState({values})            
        }
    }

    fatorial() {

        let number = this.state.displayValue
        let fatorial = 1;
        let cont = parseFloat(number);

        while (cont >= 1) {

            fatorial *= cont;
            cont--;
        }

        this.state.values[0] = fatorial
        this.setState({displayValue: this.state.values[0]})        
    }

    backspace() {
        let displayValue = this.state.displayValue;

        if (displayValue.length > 0) {
            displayValue = displayValue.substring(0, displayValue.length - 1);

            this.setState({displayValue}) 

            if (displayValue.length === 0) {
                this.setState({displayValue: '0'})
            }
        } else {
            this.setState({displayValue: '0'})
        }
    }

    render() {

        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                <Button label="C" click= {this.clearMemory} operation />
                <Button label="n!" click= {this.fatorial} operation />
                <Button label="DEL" click= {this.backspace} operation/>
                <Button label="%" click= {this.setOperation} operation/>
                <Button label="7" click= {this.addDigit} />
                <Button label="8" click= {this.addDigit} />
                <Button label="9" click= {this.addDigit} />
                <Button label="/" click= {this.setOperation} operation/>
                <Button label="4" click= {this.addDigit} />
                <Button label="5" click= {this.addDigit} />
                <Button label="6" click= {this.addDigit} />
                <Button label="*" click= {this.setOperation} operation/>
                <Button label="1" click= {this.addDigit} />
                <Button label="2" click= {this.addDigit} />
                <Button label="3" click= {this.addDigit} />
                <Button label="-" click= {this.setOperation} operation />
                <Button label="." click= {this.addDigit} />
                <Button label="0" click= {this.addDigit} />                
                <Button label="=" click= {this.setOperation} equals />
                <Button label="+" click= {this.setOperation} operation/>
            </div>
        )
    }
}