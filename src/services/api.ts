import ky from 'ky';
import { auth } from '../utils/firebase';

interface PostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}
const idToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('ユーザーが認証されていません');
  }

  const token = await user.getIdToken();
  return { token };
};

function createApiInstance() {
  return ky.create({
    headers: {
      'Content-Type': 'application/json',
    },
    prefixUrl: '/api/', // 相対URLを使用
    retry: {
      limit: 3, // 最大リトライ回数
      methods: ['get', 'post', 'put', 'patch', 'delete'], // リトライするHTTPメソッド
      statusCodes: [408, 500, 502, 503, 504], // リトライするステータスコード
    },
    timeout: 5000, // タイムアウトを5秒に設定
    hooks: {
      beforeRequest: [
        async (request) => {
          console.log(`📡 Sending request to: ${request.url}`);
          const token = (await idToken()).token; // トークンを取得する関数

          request.headers.set('Authorization', `Bearer ${token}`);
        },
      ],
    },
  });
}

export async function createGet<T>(pass: string) {
  const api = createApiInstance();

  try {
    // 🌟 `Response` オブジェクトを取得
    const response = await api.get<T>(pass);

    // ✅ ステータスコードを取得
    console.log(`✅ Response Status: ${response.status}`);

    // 🌟 JSONデータを取得
    const responseData: T = await response.json();
    console.log('📌 Created Get:', responseData);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('❌ Error creating get:', error);
    throw error;
  }
}

export async function createPost<T>(pass: string, postData: any) {
  const api = createApiInstance();

  try {
    // 🌟 `Response` オブジェクトを取得
    const response = await api.post<T>(pass, {
      json: postData,
    });

    // ✅ ステータスコードを取得
    console.log(`✅ Response Status: ${response.status}`);

    // 🌟 JSONデータを取得
    const data: T = await response.json();
    const responseData: T[] = [];
    responseData.push(data);
    console.log('📌 Created Post:', responseData);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
}

export async function createPut<T>(pass: string, postData: any) {
  const api = createApiInstance();

  try {
    // 🌟 `Response` オブジェクトを取得
    const response = await api.put(pass, {
      json: postData,
    });
    const responseData: T = await response.json();

    // ✅ ステータスコードを取得
    console.log(`✅ Response Status: ${response.status}`);

    // // 🌟 `Response` オブジェクトを取得
    // const responseGet = await api.get<T[]>(pass);

    // // 🌟 JSONデータを取得（型Tを適用）
    // const responseData: T[] = await responseGet.json();

    console.log('📌 Created Put:', responseData);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('❌ Error creating put:', error);
    throw error;
  }
}

export async function createPatch<T>(
  pass: string,
  updateData: Partial<Omit<PostResponse, 'id'>>
): Promise<{ status: number; data: T[] }> {
  const api = createApiInstance();

  try {
    // 🌟 `Response` オブジェクトを取得
    const response = await api.patch(pass, {
      json: updateData,
    });

    // ✅ ステータスコードを取得
    console.log(`✅ Response Status: ${response.status}`);

    // 🌟 `Response` オブジェクトを取得
    const responseGet = await api.get<T[]>(pass);

    // 🌟 JSONデータを取得（型Tを適用）
    const responseData: T[] = await responseGet.json();
    console.log('📌 Updated Patch:', responseData);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('❌ Error updating patch:', error);
    throw error;
  }
}

export async function createDelete<T>(
  pass: string,
  id: string
): Promise<{ status: number; data: T[] }> {
  const api = createApiInstance();

  try {
    // 🌟 `Response` オブジェクトを取得
    const response = await api.delete(`${pass}?id=${id}`);

    // ✅ ステータスコードを取得
    console.log(`✅ Response Status: ${response.status}`);

    // 🌟 `Response` オブジェクトを取得
    const responseGet = await api.get<T[]>(pass);

    // 🌟 JSONデータを取得（型Tを適用）
    const responseData: T[] = await responseGet.json();
    console.log('📌 Delete:', responseData);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('❌ Error delete:', error);
    throw error;
  }
}
