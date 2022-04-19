import { Config } from ".."

export const handleToken = (req: any, res: { json: (arg0: { access_token: string }) => void }) => {
  res.json(
    {
      access_token: Config.ACCESS_TOKEN
    })
}
