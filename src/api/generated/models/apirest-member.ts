/* tslint:disable */
/* eslint-disable */
/**
 * Authentication
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { APILastBattleTime } from './apilast-battle-time';
// May contain unused imports in some cases
// @ts-ignore
import type { APIRestStatistics } from './apirest-statistics';

/**
 * 
 * @export
 * @interface APIRestMember
 */
export interface APIRestMember {
    /**
     * 
     * @type {number}
     * @memberof APIRestMember
     */
    'id': number;
    /**
     * 
     * @type {string}
     * @memberof APIRestMember
     */
    'nickname': string;
    /**
     * 
     * @type {APIRestStatistics}
     * @memberof APIRestMember
     */
    'general'?: APIRestStatistics | null;
    /**
     * 
     * @type {APILastBattleTime}
     * @memberof APIRestMember
     */
    'last_battle_time': APILastBattleTime;
}

