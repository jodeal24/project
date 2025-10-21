export default function handler(req, res) {
  res.status(200).json({
    hasPassword: Boolean(process.env.ADMIN_PASSWORD),
    envs: Object.keys(process.env)
      .filter(k => k.includes("ADMIN"))
  });
}
