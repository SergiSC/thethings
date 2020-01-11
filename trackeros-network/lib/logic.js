/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.trackerosnetwork.TradeHolder} tradeHolder
 * @transaction
 */
async function TradeHolder(tx) {

    // Update the asset with the new value.
    tx.pallet.holder = tx.holder;

    // Get the asset registry for the asset.
    let palletRegistry = await getAssetRegistry('org.trackerosnetwork.Pallet');

    // Emit an event for the modified asset.
    let tradeNotification = getFactory().newEvent('org.trackerosnetwork', 'TradeNotification');
    tradeNotification.pallet = tx.pallet;
    emit(tradeNotification);

    await palletRegistry.update(tx.pallet);
}

/**
 * Sample transaction
 * @param {org.trackerosnetwork.NewCoords} newCoords
 * @transaction
 */
async function NewCoords(tx) {
    tx.pallet.lat = tx.newLat;
    tx.pallet.lng = tx.newLng;
    tx.pallet.loc = tx.newLoc;

    let palletRegistry = await getAssetRegistry('org.trackrosnetwork.Pallet');

    await palletRegistry.update(tx.pallet);
}
