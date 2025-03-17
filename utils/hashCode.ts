import  * as bcrypt from 'bcrypt'


export async function hashCode( code: string , countRound: number = 5 ){
    return await bcrypt.hash(code , countRound)
}