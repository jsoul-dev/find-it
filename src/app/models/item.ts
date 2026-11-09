export interface Item {
  id: string;
  type: 'Lost' | 'Found';
  name: string;
  description: string;
  contact: string;
  lat: number;
  lng: number;
  status: 'Open' | 'Claimed';
  createdAt?: string;
}

export type NewItem = Omit<Item, 'id' | 'createdAt'>;
