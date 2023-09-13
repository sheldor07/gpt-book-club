import clientPromise from "../../utils/mongodb";

export default async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;
    const allowedOrigin = [
      "https://www.gptbook.club",
      "https://gptbook.club/",
      "http://localhost:3000",
    ];

    // Check if the request's origin is allowed
    if (!allowedOrigin.includes(req.headers.origin)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    // Ensure email is provided

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!req.headers.authorization)
      return res.status(401).json({ error: "Unauthorized" });
    const bearerAuth = req.headers.authorization; // Extract the token
    const authToken = bearerAuth.split(" ")[1];
    if (authToken !== process.env.NEXT_PUBLIC_MONGODB_TOKEN)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const client = await clientPromise;
      const db = client.db();

      // Insert the email into the collection (e.g., 'signups')
      await db.collection("signups").insertOne({ email });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};
