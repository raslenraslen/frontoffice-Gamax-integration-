export class Pack {
  pack_id: number;
  packName: string;
  description: string;
  availableDate: string; // or Date
  expirationDate: string; // or Date

  constructor(data: {
    pack_id: number;
    packName: string;
    description: string;
    availableDate: string;
    expirationDate: string;
  }) {
    this.pack_id = data.pack_id;
    this.packName = data.packName;
    this.description = data.description;
    this.availableDate = data.availableDate;
    this.expirationDate = data.expirationDate;
  }
}
