import ApiHandl from './api';
import state from './stateholder';
import Painter from '../elemSection/pageRender';
import Randomizer from './randomisers';

class WinnerHandler {
  Api:ApiHandl;

  Randomizer:Randomizer;

  Painter:Painter;

  constructor() {
    this.Api = new ApiHandl();
    this.Painter = new Painter();
    this.Randomizer = new Randomizer();
  }

  async handleWinRace():Promise<void> {
    const winner = state.currentWinners[0];
    const resp = await this.Api.getWinner(winner.id);

    if (resp.status !== 200) {
      winner.wins = 1;
      await this.Api.createWinner(winner);
    } else {
      winner.wins = (await resp.body).wins as number + 1;
      if ((await resp.body).time < winner.time) {
        winner.time = (await resp.body).time;
      }
    }
    state.currentWinners = [];
    await this.Api.updateWinner(winner);
  }

  async renderWinners():Promise<void> {
    const response = await this.Api.getWinners(state.winnersPage, state.sorttype, state.sortorder);
    this.Painter.winnersRender(response.info, response.count, state.winnersPage);
    const btncontainer = document.querySelector('.page_container');
    btncontainer?.addEventListener('click', (e) => this.handleWinnersPage(e));
    this.updateState();
  }

  updateState():void {
    const wincolumn = document.getElementsByClassName('wins')[0];
    const timecolumn = document.getElementsByClassName('time')[0];
    function handlesort(element:HTMLElement) {
      if (element.dataset.type === state.sorttype) {
        state.sortorder = state.sortorder === 'DESC' ? 'ASC' : 'DESC';
      } else {
        state.sorttype = element.dataset.type as string;
      }
    }
    wincolumn.addEventListener('click', (e) => {
      handlesort(e.target as HTMLElement);
      this.renderWinners();
    });
    timecolumn.addEventListener('click', (e) => {
      handlesort(e.target as HTMLElement);
      this.renderWinners();
    });
  }

  async handleWinnersPage(e:Event):Promise<void> {
    const target = e.target as HTMLElement;
    const number = target.innerHTML;
    state.winnersPage = Number(number);
    this.renderWinners();
  }
}
export default WinnerHandler;
