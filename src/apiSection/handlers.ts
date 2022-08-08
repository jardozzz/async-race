import state from './stateholder';
import WinnerHandler from './winners';

class Handlers extends WinnerHandler {
  async handleCreateCar():Promise<void> {
    const container = document.querySelector('.createcontainer');
    const name = (container?.querySelector('.input_text') as HTMLInputElement).value;

    if (name === '') { window.alert('Введите имя'); } else {
      const color = (container?.querySelector('.input_color') as HTMLInputElement).value;
      const car = { name, color };
      await this.Api.createCar(car);
      (container?.querySelector('.input_color') as HTMLInputElement).value = '';
      (container?.querySelector('.input_text') as HTMLInputElement).value = '';
      this.doBoard();
    }
  }

  async handleSelectCar(e:Event):Promise<void> {
    const target = e.target as HTMLElement;
    const { id } = (target.closest('.row') as HTMLElement).dataset;
    document.querySelectorAll('.select').forEach((elem) => elem.removeAttribute('disabled'));
    target.setAttribute('disabled', 'disabled');

    const resp = await this.Api.getCar(Number(id));
    const container = document.querySelector('.updatecontainer');
    const name = (container?.querySelector('.input_text') as HTMLInputElement);
    const color = (container?.querySelector('.input_color') as HTMLInputElement);

    name.value = resp.name;
    state.selectedName = resp.name;
    color.value = resp.color;
    state.selecterColor = resp.color;
    state.selectedID = Number(id);
  }

  async handleDeleteCar(e:Event):Promise<void> {
    const { id } = ((e.target as HTMLElement).closest('.row') as HTMLElement).dataset;

    if (Number(id) === state.selectedID) {
      const container = document.querySelector('.updatecontainer');
      const name = (container?.querySelector('.input_text') as HTMLInputElement);
      const color = (container?.querySelector('.input_color') as HTMLInputElement);

      name.value = '';
      color.value = '';
    }
    await this.Api.deleteCar(Number(id));
    this.Api.deleteWinner(Number(id));
    this.doBoard();
  }

  async handleUpdateCar():Promise<void> {
    const container = document.querySelector('.updatecontainer');
    const name = (container?.querySelector('.input_text') as HTMLInputElement).value;
    const color = (container?.querySelector('.input_color') as HTMLInputElement).value;
    const id = state.selectedID;
    const car = { name, color, id };

    await this.Api.updateCar(car);
    this.doBoard();
  }

  async handleGenerateCars():Promise<void> {
    const arr = Array(100).fill('').map(() => this.Api.createCar(this.Randomizer.getRandomCar()));
    await Promise.all(arr);
    await this.doBoard();
  }

  async handleStart(e:Event):Promise<void> {
    const targetDistance = ((0.8 * window.innerWidth) - 190);
    const target = e.target as HTMLElement;
    const { id } = (target.closest('.row') as HTMLElement).dataset;
    const name = (target.closest('.row') as HTMLElement).querySelector('.name')?.innerHTML as string;
    const info = await this.Api.changeEngine(Number(id), 'started');
    const car = (target.closest('.row') as HTMLElement).querySelector('.car') as HTMLElement;
    const stop = (target.closest('.row') as HTMLElement).querySelector('.stopeng');
    const stamp = Date.now();

    stop?.removeAttribute('disabled');
    target.setAttribute('disabled', 'disabled');

    car.addEventListener('animationend', () => {
      if (state.isRace) {
        state.currentWinners.push({ id: Number(id), time: targetDistance / info.velocity });
        state.isRace = false;
        this.Painter.overlay(name, targetDistance / info.velocity);
        (document.querySelector('.overlay') as HTMLElement).style.display = 'block';
        document.querySelector('.overlay')?.addEventListener('click', () => { (document.querySelector('.overlay') as HTMLElement).style.display = 'none'; });
        this.handleWinRace();
      }
    });

    car.style.animationDuration = ` ${(targetDistance + 80) / info.velocity}s`;
    car.style.animationPlayState = 'running';

    const resp = await this.Api.drive(Number(id));
    if (resp) {
      car.style.animationPlayState = 'paused';
      const distance = (Date.now() - stamp) * (info.velocity / 1000);
      if (distance > targetDistance && state.isRace) {
        state.currentWinners.push({ id: Number(id), time: targetDistance / info.velocity });
        state.isRace = false;
        this.Painter.overlay(name, targetDistance / info.velocity);
        (document.querySelector('.overlay') as HTMLElement).style.display = 'block';
        document.querySelector('.overlay')?.addEventListener('click', () => { (document.querySelector('.overlay') as HTMLElement).style.display = 'none'; });
        await this.handleWinRace();
      }
    }
  }

  async handleRace():Promise<void> {
    state.isRace = true;
    await this.doBoard();
    document.querySelectorAll('.starteng').forEach((e) => (e as HTMLElement).click());
    document.querySelectorAll('button').forEach((e) => {
      if (!e.classList.contains('stop')) e.setAttribute('disabled', 'disabled');
    });
  }

  async handleReset():Promise<void> {
    state.isRace = false;
    document.querySelectorAll('button').forEach((e) => {
      if (!e.classList.contains('stop')) e.removeAttribute('disabled');
    });
    document.querySelectorAll('.stopeng').forEach((e) => (e as HTMLElement).click());
  }

  async handleStop(e:Event):Promise<void> {
    const target = e.target as HTMLElement;
    const { id } = (target.closest('.row') as HTMLElement).dataset;
    const { color } = await this.Api.getCar(Number(id));
    const start = (target.closest('.row') as HTMLElement).querySelector('.starteng');

    target.setAttribute('disabled', 'disabled');
    await this.Api.changeEngine(Number(id), 'stopped');
    this.Painter.trackRender((target.closest('.row') as HTMLElement), color);
    start?.removeAttribute('disabled');
  }

  async handleGaragePage(e:Event):Promise<void> {
    const target = e.target as HTMLElement;
    const number = target.innerHTML;
    state.mainPage = Number(number);
    this.doBoard();
  }

  async doBoard():Promise<void> {
    const finish = await this.Api.getCars(state.mainPage);
    await this.Painter.boardRender(finish.cars, finish.count, state.mainPage);
    const btncontainer = document.querySelector('.page_container');
    btncontainer?.addEventListener('click', (e) => this.handleGaragePage(e));

    document.querySelectorAll('.select').forEach((elem) => elem.addEventListener('click', (evt) => this.handleSelectCar(evt)));
    document.querySelectorAll('.delete').forEach((elem) => elem.addEventListener('click', (evt) => this.handleDeleteCar(evt)));
    document.querySelectorAll('.starteng').forEach((elem) => elem.addEventListener('click', (evt) => this.handleStart(evt)));
    document.querySelectorAll('.stopeng').forEach((elem) => elem.addEventListener('click', (evt) => this.handleStop(evt)));
  }

  doInputs():void {
    this.Painter.garageRender();
    this.doSavedInputs();
    document.querySelector('.create')?.addEventListener('click', () => this.handleCreateCar());
    document.querySelector('.update')?.addEventListener('click', () => this.handleUpdateCar());
    document.querySelector('.cargen')?.addEventListener('click', () => this.handleGenerateCars());
    document.querySelector('.race')?.addEventListener('click', () => this.handleRace());
    document.querySelector('.stop')?.addEventListener('click', () => this.handleReset());
  }

  async doGarage():Promise<void> {
    this.Painter.topRender();
    this.doInputs();
    this.doBoard();
    document.getElementsByClassName('WinnersRender')[0].addEventListener('click', () => this.doWinners());
  }

  async doWinners():Promise<void> {
    await this.Painter.topRender();
    this.renderWinners();
    document.getElementsByClassName('garageRender')[0].addEventListener('click', () => this.doGarage());
  }

  doSavedInputs():void {
    const textCreate = document.querySelector('.text_create') as HTMLInputElement;
    textCreate?.addEventListener('change', () => { state.nameInput = textCreate.value; });
    textCreate.value = state.nameInput;

    const colorCreate = document.querySelector('.color_create') as HTMLInputElement;
    colorCreate?.addEventListener('change', () => { state.colorInput = colorCreate.value; });
    colorCreate.value = state.colorInput;

    const textUpdate = document.querySelector('.text_update') as HTMLInputElement;
    textUpdate.value = state.selectedName;

    const colorUpdate = document.querySelector('.color_update') as HTMLInputElement;
    colorUpdate.value = state.selecterColor;
  }
}
export default Handlers;
