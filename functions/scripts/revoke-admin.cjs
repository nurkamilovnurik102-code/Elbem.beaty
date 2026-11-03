/** Local developer/owner only. Revoke an old administrator after handover.
 * Needs application-default Google service account credentials outside the repo.
 * Run only after confirming that the replacement administrator can sign in.
 */
const admin = require('firebase-admin');
const projectId=process.env.GOOGLE_CLOUD_PROJECT;
const email=process.argv[2];
if(!projectId||!email||!/^\S+@\S+\.\S+$/.test(email)){
 console.error('Usage: GOOGLE_CLOUD_PROJECT=el-bem-beauty GOOGLE_APPLICATION_CREDENTIALS=/secure/service-account.json node scripts/revoke-admin.cjs old.owner@example.com');
 process.exit(1);
}
admin.initializeApp({credential:admin.credential.applicationDefault(),projectId});
(async()=>{
 const user=await admin.auth().getUserByEmail(email);
 const claims={...(user.customClaims||{})};
 delete claims.admin;
 await admin.auth().setCustomUserClaims(user.uid,claims);
 await admin.auth().revokeRefreshTokens(user.uid);
 console.log('Admin role removed and refresh tokens revoked for UID:',user.uid);
 console.log('Previously issued ID tokens may remain valid until expiration; verify the old owner no longer has access.');
})().then(()=>process.exit(0)).catch(error=>{console.error(error.message);process.exit(1)});
