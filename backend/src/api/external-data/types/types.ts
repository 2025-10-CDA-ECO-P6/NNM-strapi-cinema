import {DateTime} from "@strapi/types/dist/schema/attribute";
import {date} from "yup";

export interface Movie {
    id: number,
    title: string,
    description : string,
    release_date : Date,
    realisator : string,
    actors : Actor[]

}

export interface MovieResponse {
    page : number,
    results : Movie[],
    total_pages : number,
    total_results : number
}

export interface Actor {
    id : number,
    name: string,
    last_name  : string,
    birth_date : Date,
    associated_movies : Movie[]
}