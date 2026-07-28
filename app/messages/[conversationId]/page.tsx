import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MessagesExperience } from "@/components/messages/messages-experience";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../../account-pages.module.css";
import { fetchConversationMessages,fetchConversations,markApiConversationRead } from "@/lib/api/social_api";

export default async function ConversationPage({params}:{params:Promise<{conversationId:string}>}){const user=await requireCurrentUser();const {conversationId}=await params;const [conversations,messages]=await Promise.all([fetchConversations(),fetchConversationMessages(conversationId)]);if(messages.success)await markApiConversationRead(conversationId);return <div className={styles.page}><SiteHeader/><main className={`${styles.main} ${styles.messagesMain}`}><PageContainer><header className={styles.header}><p className={styles.eyebrow}>Campus conversations</p><h1>Messages</h1></header>{conversations.success&&messages.success?<MessagesExperience conversations={conversations.data} activeId={conversationId} initialMessages={messages.data} currentUserId={user.id??user._id??""}/>:<div className={styles.panel}><h2>Conversation unavailable</h2><p>{conversations.success?messages.message:conversations.message}</p></div>}</PageContainer></main><SiteFooter/></div>}
