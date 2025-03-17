import * as bcrypt from 'bcrypt'

export async function checkHashCode(codeBeingChecked: string , code: string) {
    return await bcrypt.compare(codeBeingChecked , code)
}