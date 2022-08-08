/* eslint-disable class-methods-use-this */
import ElementCreator from './element';
import './page.css';
import carsvg from './car';
import { AllInfo, CarArray } from '../consts/interfaces/types';
import stateHolder from '../apiSection/stateholder';
import flag from './flag';

class Draw {
  topRender():void {
    document.body.innerHTML = '';
    const statecontainer = ElementCreator('div', undefined, ['statecontainer'], document.body);
    ElementCreator('button', 'Garage', ['reset', 'create', 'garageRender'], statecontainer);
    ElementCreator('button', 'Winners', ['reset', 'create', 'WinnersRender'], statecontainer);
  }

  garageRender():void {
    const inputcontainer = ElementCreator('div', undefined, ['inputcontainer'], document.body);
    const Creatediv = ElementCreator('div', undefined, ['createcontainer'], inputcontainer);
    ElementCreator('input', undefined, ['input_text', 'text_create'], Creatediv);
    ElementCreator('input', undefined, ['input_color', 'color_create'], Creatediv, 'color');
    ElementCreator('button', 'Create', ['reset', 'create'], Creatediv);
    const Updatediv = ElementCreator('div', undefined, ['updatecontainer'], inputcontainer);
    ElementCreator('input', undefined, ['input_text', 'text_update'], Updatediv);
    ElementCreator('input', undefined, ['input_color', 'color_update'], Updatediv, 'color');
    ElementCreator('button', 'Update', ['reset', 'update'], Updatediv);
    const btncontainer = ElementCreator('div', undefined, ['btncontainer'], document.body);
    ElementCreator('button', 'Race', ['reset', 'race'], btncontainer);
    ElementCreator('button', 'Reset', ['reset', 'stop'], btncontainer);
    ElementCreator('button', 'Generate Cars', ['cargen', 'reset'], btncontainer);
    ElementCreator('div', undefined, ['totals'], document.body);
    ElementCreator('div', undefined, ['pagenum'], document.body);
    ElementCreator('div', undefined, ['board'], document.body);
  }

  boardRender(arr:CarArray, count:number, page:number):void {
    const reg = /fill="#[0-9a-f]{6}"/;
    const prev = [document.querySelector('.totals'), document.querySelector('.pagenum')];
    const board = document.querySelector('.board') as HTMLElement;

    (prev[0] as HTMLElement).innerHTML = `Number of Cars: ${count}`;
    (prev[1] as HTMLElement).innerHTML = `Page: ${page}`;
    board.innerHTML = '';
    this.pageButtonsRender(count, 7);
    arr.forEach((e) => {
      const row = ElementCreator('div', undefined, ['row'], board, undefined, ['id', `${e.id}`]);
      const controls = ElementCreator('div', undefined, ['controls'], row);

      ElementCreator('div', `${e.name}`, ['control', 'name'], controls);
      const select = ElementCreator('button', 'Select', ['control', 'select'], controls);
      if (Number(row.dataset.id) === stateHolder.selectedID) {
        select.setAttribute('disabled', 'disabled');
      }
      ElementCreator('button', 'Delete', ['control', 'delete'], controls);
      ElementCreator('button', 'Go', ['control', 'starteng'], controls);

      const stopbtn = ElementCreator('button', 'Back', ['control', 'stopeng'], controls);
      stopbtn.setAttribute('disabled', 'disabled');

      const track = ElementCreator('div', undefined, ['track'], row);
      ElementCreator('div', carsvg.replace(reg, `fill="${e.color}"`), ['car'], track);
      ElementCreator('div', flag, ['flag'], track);
    });
  }

  pageButtonsRender(count:number, limit:number):void {
    const num = Math.ceil(count / limit);
    document.querySelector('.page_container')?.remove();
    const pageContainer = ElementCreator('div', undefined, ['page_container'], document.body);
    for (let i = 0; i < num; i += 1) {
      ElementCreator('button', `${i + 1}`, ['page_btn'], pageContainer);
    }
  }

  trackRender(parent:HTMLElement, color:string):void {
    const reg = /fill="#[0-9a-f]{6}"/;
    const inner = parent.querySelector('.track');
    inner?.remove();
    const track = ElementCreator('div', undefined, ['track'], parent);

    ElementCreator('div', carsvg.replace(reg, `fill="${color}"`), ['car'], track);
    ElementCreator('div', flag, ['flag'], track);
  }

  winnersRender(arr:AllInfo[], count:number, page:number):void {
    const reg = /fill="#[0-9a-f]{6}"/;
    const prev = [document.querySelector('.winner_table'), document.querySelector('.totals'),
      document.querySelector('.pagenum')];
    prev.forEach((e) => {
      if (e) e.remove();
    });

    ElementCreator('div', `Number of Winners: ${count}`, ['totals'], document.body);
    ElementCreator('div', `Page: ${page}`, ['pagenum'], document.body);

    const winnerTable = ElementCreator('div', undefined, ['winner_table'], document.body);
    const TableHeader = ElementCreator('div', undefined, ['table_header'], winnerTable);
    ElementCreator('div', 'Position', ['winner_item', 'position'], TableHeader);
    ElementCreator('div', 'Car Icon', ['winner_item', 'car_item'], TableHeader);
    ElementCreator('div', 'Number of Wins', ['winner_item', 'wins', 'time_elem'], TableHeader, undefined, ['type', 'wins']);
    ElementCreator('div', 'Name', ['winner_item', 'name'], TableHeader);
    ElementCreator('div', 'Time', ['winner_item', 'time', 'time_elem'], TableHeader, undefined, ['type', 'time']);

    arr.forEach((element, index) => {
      const winnerItem = ElementCreator('div', undefined, ['winner_item'], winnerTable);
      ElementCreator('div', `${index + 1}`, ['position'], winnerItem);
      ElementCreator('div', carsvg.replace(reg, `fill="${element.rest.color}"`), ['car_item'], winnerItem);
      ElementCreator('div', `${element.wins}`, ['win_nums', 'win_elem'], winnerItem);
      ElementCreator('div', element.rest.name, ['name'], winnerItem);
      ElementCreator('div', `${element.time.toFixed(3)}`, ['time', 'time_elem'], winnerItem);
    });
    this.pageButtonsRender(count, 10);
  }

  overlay(name:string, time:number):void {
    const overlay = document.getElementsByClassName('overlay')[0];
    overlay?.remove();
    ElementCreator('div', `ПОБЕЖДАЕТ ${name} с временем ${time}`, ['overlay'], document.body);
  }
}
export default Draw;
