import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MessagesExperience } from "@/components/messages/messages-experience";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../account-pages.module.css";
import { fetchConversations } from "@/lib/api/social_api";

export default async function MessagesPage(){const user=await requireCurrentUser();const conversations=await fetchConversations();return <div className={styles.page}><SiteHeader/><main className={`${styles.main} ${styles.messagesMain}`}><PageContainer><header className={styles.header}><p className={styles.eyebrow}>Campus conversations</p><h1>Messages</h1></header>{conversations.success?<MessagesExperience conversations={conversations.data} currentUserId={user.id??user._id??""}/>:<div className={styles.panel}><h2>Messages unavailable</h2><p>{conversations.message}</p></div>}</PageContainer></main><SiteFooter/></div>}
