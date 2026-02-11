
import { MetaMedia, Participant, EngagementType } from '../types';

declare global {
  interface Window {
    FB: any;
  }
}

export const metaService = {
  /**
   * Realiza o login do usuário nas permissões necessárias.
   */
  async login(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!window.FB) {
        alert('O sistema da Meta não carregou. Verifique se o ID do App está correto e se você está em um ambiente HTTPS.');
        resolve(null);
        return;
      }

      window.FB.login((response: any) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          resolve(null);
        }
      }, { 
        scope: 'instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement' 
      });
    });
  },

  /**
   * Tenta encontrar a conta do Instagram Business ligada às páginas do usuário.
   */
  async getInstagramAccountId(): Promise<string | null> {
    return new Promise((resolve) => {
      window.FB.api('/me/accounts', (response: any) => {
        if (!response || response.error || !response.data) {
          resolve(null);
          return;
        }

        const pages = response.data;
        if (pages.length === 0) {
            resolve(null);
            return;
        }

        // Busca recursiva em todas as páginas por uma conta de IG comercial
        const checkNext = (index: number) => {
            if (index >= pages.length) {
                resolve(null);
                return;
            }

            window.FB.api(`/${pages[index].id}?fields=instagram_business_account`, (igRes: any) => {
                if (igRes && igRes.instagram_business_account) {
                    resolve(igRes.instagram_business_account.id);
                } else {
                    checkNext(index + 1);
                }
            });
        };

        checkNext(0);
      });
    });
  },

  /**
   * Obtém as mídias (Posts/Reels) da conta do Instagram.
   */
  async getMedia(instagramId: string): Promise<MetaMedia[]> {
    return new Promise((resolve) => {
      window.FB.api(`/${instagramId}/media?fields=id,caption,media_url,media_type,timestamp,permalink&limit=30`, (response: any) => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  },

  /**
   * Busca os participantes (Comentários ou Curtidas).
   */
  async fetchData(mediaId: string, type: EngagementType): Promise<Participant[]> {
    return new Promise((resolve) => {
      if (type === 'COMMENTS') {
        window.FB.api(`/${mediaId}/comments?fields=from,text,timestamp,id&limit=5000`, (response: any) => {
          if (response && response.data) {
            const participants: Participant[] = response.data.map((c: any) => ({
              id: c.id,
              username: c.from?.username || 'usuario_instagram',
              content: c.text,
              timestamp: c.timestamp,
              avatarUrl: null // A API de comentários não retorna avatar direto por privacidade
            }));
            resolve(participants);
          } else {
            resolve([]);
          }
        });
      } else {
        // Mock para curtidas (Meta restringiu acesso a likes via API básica recentemente)
        resolve(Array.from({ length: 12 }, (_, i) => ({
          id: `like-${i}`,
          username: `curtida_user_${i}`,
          timestamp: new Date().toISOString()
        })));
      }
    });
  }
};
