import { Winner } from '../consts/interfaces/types';

const stateHolder = {
  mainPage: 1,
  winnersPage: 1,
  selectedID: 0,
  selecterColor: '',
  selectedName: '',
  nameInput: '',
  colorInput: '',
  currentWinners: [] as Winner[],
  isRace: false,
  sorttype: 'time',
  sortorder: 'ASC',
};
export default stateHolder;
