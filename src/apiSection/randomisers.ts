import { Car } from '../consts/interfaces/types';

class Randomizer {
  names:string[];

  models:string[];

  constructor() {
    this.names = ['Ржавое ведро', 'Тарантайка', 'Масложор', 'Вундервафля', 'Детище стимпанка', 'Пепелац', 'Шайтан-арба', 'Мстительный дух', 'Плотва', 'Гончая войны'];
    this.models = ['на пару', 'на РИТЭГах', 'на мазуте', 'без колес', 'на термояде', 'без руля', 'на мускульной тяге', 'без тормозов', 'с креном на корму', 'с креном на нос'];
  }

  getRandomCar():Partial<Car> {
    function randnum() {
      return Math.floor(Math.random() * 10);
    }
    function randcolor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    const CarName = `${this.names[randnum()]} ${this.models[randnum()]}`;
    const CarColor = `${randcolor()}`;
    return {
      name: CarName,
      color: CarColor,
    };
  }
}
export default Randomizer;
