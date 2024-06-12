export class Country{
    id!:number;
    name:string | null = null;
    image:string ='';
    description:string | null =null;
    slug:string | null = null;
    status:number = 0;
    meta_title!: string | null;
    meta_description!: string | null;
    meta_keywords!: string | null;
}
export interface ChangeStatusResponse {
    message: string;
  }
  export interface DeleteResponse {
    message: string;
  }