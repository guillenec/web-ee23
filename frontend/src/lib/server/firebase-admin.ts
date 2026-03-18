import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const asJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (asJson) {
    const parsed = JSON.parse(asJson) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    return {
      projectId: parsed.project_id ?? "",
      clientEmail: parsed.client_email ?? "",
      privateKey: (parsed.private_key ?? "").replace(/\\n/g, "\n"),
    };
  }

  return {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? "",
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "",
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  };
}

function getAdminApp() {
  if (getApps().length) {
    return getApp();
  }

  const account = getServiceAccount();
  if (!account.projectId || !account.clientEmail || !account.privateKey) {
    throw new Error("Faltan variables FIREBASE_ADMIN_* para rutas server");
  }

  return initializeApp({
    credential: cert(account),
  });
}

export function getAdminAuth() {
  const app = getAdminApp();
  return getAuth(app);
}

export function getAdminDb() {
  const app = getAdminApp();
  return getFirestore(app);
}
