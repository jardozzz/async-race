/* eslint-disable class-methods-use-this */
import { Serverpath } from '../consts/enums/enums';
import {
  AllInfo, Car, CarArray, EngineResp, Winner,
} from '../consts/interfaces/types';

export class ApiHandler {
  async getCars(page:number):Promise<{ cars:CarArray, count:number }> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.garage}?_page=${page}&_limit=7`);
    const head = q.headers.get('X-Total-Count');
    const count = head ? Number(head) : 0;
    const cars = await q.json();
    return { cars, count };
  }

  async createCar(obj:Partial<Car>):Promise<Car> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    return q.json();
  }

  async deleteCar(id:number):Promise<void> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.garage}/${id}`, {
      method: 'Delete',
    });
    return q.json();
  }

  async updateCar(obj:Car):Promise<Car> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.garage}/${obj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    return q.json();
  }

  async getCar(id:number):Promise<Car> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.garage}/${id}`);
    if (!q.ok) throw new Error();
    return q.json();
  }

  async changeEngine(id:number, status:string):Promise<EngineResp> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.engine}?${Serverpath.id}=${id}&${Serverpath.status}=${status}`, {
      method: 'PATCH',
    });
    return q.json();
  }

  async drive(id:number):Promise<boolean> {
    try {
      const q = await fetch(`${Serverpath.base}/${Serverpath.engine}?${Serverpath.id}=${id}&${Serverpath.status}=drive`, {
        method: 'PATCH',
      });

      if (await q.status !== 200) throw new Error('ERROR');
      return false;
    } catch (err) {
      return true;
    }
  }

  async deleteWinner(id:number):Promise<void> {
    await fetch(`${Serverpath.base}/${Serverpath.winners}/${id}`, {
      method: 'Delete',
    });
  }

  async getWinner(id:number):Promise<{ body:Promise<Winner>, status:number }> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.winners}/${id}`);
    const body = await q.json();
    return { body, status: q.status };
  }

  async createWinner(obj:Winner):Promise<void> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.winners}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    return q.json();
  }

  async updateWinner(obj:Winner):Promise<Winner> {
    const q = await fetch(`${Serverpath.base}/${Serverpath.winners}/${obj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    return q.json();
  }

  async getWinners(page:number, sorttype:string, sortorder :string, limit = 10):
  Promise<{ info:AllInfo[];count:number }> {
    const url = `${Serverpath.base}/${Serverpath.winners}?_page=${page}&_limit=${limit}&_sort=${sorttype}&_order=${sortorder}`;
    const q = await fetch(url);
    const resp = await q.json();
    const head = await q.headers.get('X-Total-Count');
    const count = head ? Number(head) : 0;
    const info = await Promise.all(await resp.map(async (element:Winner) => ({
      ...element,
      rest: await this.getCar(element.id),
    }))) as AllInfo[];
    return { info, count };
  }
}
export default ApiHandler;
