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
import type { APIStatsTank } from './apistats-tank';

/**
 * 
 * @export
 * @interface APITank
 */
export interface APITank {
    /**
     * 
     * @type {APIStatsTank}
     * @memberof APITank
     */
    'all': APIStatsTank;
    /**
     * 
     * @type {number}
     * @memberof APITank
     */
    'last_battle_time'?: number;
    /**
     * 
     * @type {number}
     * @memberof APITank
     */
    'battle_life_time'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof APITank
     */
    'in_garage'?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof APITank
     */
    'tank_id'?: number;
}

