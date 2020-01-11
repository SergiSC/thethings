import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.trackerosnetwork{
   export enum TypeOfOwner {
      Provider,
      LogisticCompany,
   }
   export enum TypeOfIdentity {
      Admin,
      User,
   }
   export class Owner extends Participant {
      ownerId: string;
      name: string;
      typeIden: TypeOfIdentity;
      typeOwner: TypeOfOwner;
   }
   export class Pallet extends Asset {
      palletId: string;
      owner: Owner;
      holder: Owner;
      lat: string;
      lng: string;
      loc: string;
   }
   export class TradeHolder extends Transaction {
      pallet: Pallet;
      holder: Owner;
   }
   export class NewCoords extends Transaction {
      pallet: Pallet;
      newLat: string;
      newLng: string;
      newLoc: string;
   }
   export class TradeNotification extends Event {
      pallet: Pallet;
   }
// }
