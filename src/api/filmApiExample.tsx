/**
 * CONTOH API LENGKAP DENGAN SEMUA HTTP METHODS
 * File ini mendemonstrasikan GET, POST, PUT, PATCH, DELETE
 * 
 * CATATAN: Ghibli API yang kita pakai adalah READ-ONLY
 * Untuk POST/PUT/DELETE, gunakan API test seperti:
 * - JSONPlaceholder: https://jsonplaceholder.typicode.com
 * - ReqRes: https://reqres.in
 * - Mockapi: https://mockapi.io
 */

// ==================== TYPES ====================
export type Film = {
  id: string;
  title: string;
  original_title: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  image?: string;
  movie_banner?: string;
};

export type NewFilm = Omit<Film, 'id' | 'original_title' | 'movie_banner'>;

// ==================== KONFIGURASI ====================
const GHIBLI_API = 'https://ghibliapi.vercel.app';
const MOCK_API = 'https://jsonplaceholder.typicode.com'; // Untuk test POST/PUT/DELETE

// ==================== GET METHODS ====================

/**
 * GET - Mengambil semua film
 * Method: GET
 * Endpoint: /films
 */
export async function getFilms(): Promise<Film[]> {
  try {
    const response = await fetch(`${GHIBLI_API}/films`, {
      method: 'GET', // Default, bisa di-skip
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching films:', error);
    throw error;
  }
}

/**
 * GET - Mengambil satu film berdasarkan ID
 * Method: GET
 * Endpoint: /films/:id
 */
export async function getFilmById(id: string): Promise<Film> {
  try {
    const response = await fetch(`${GHIBLI_API}/films/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Film tidak ditemukan');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Error fetching film by ID:', error);
    throw error;
  }
}

/**
 * GET - Mengambil data dengan query parameters
 * Method: GET
 * Endpoint: /films?limit=5&sort=title
 * 
 * CONTOH: getFilmsWithQuery({ limit: 5, sort: 'title' })
 */
export async function getFilmsWithQuery(params: {
  limit?: number;
  sort?: string;
}): Promise<Film[]> {
  try {
    // Cara membuat query string
    const queryParams = new URLSearchParams();
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    const url = `${GHIBLI_API}/films?${queryParams.toString()}`;
    console.log('🔗 URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Error fetching with query:', error);
    throw error;
  }
}

// ==================== POST METHOD ====================

/**
 * POST - Menambahkan film baru
 * Method: POST
 * Endpoint: /posts (menggunakan JSONPlaceholder untuk demo)
 * 
 * CONTOH:
 * const newFilm = {
 *   title: 'My New Film',
 *   director: 'John Doe',
 *   ...
 * };
 * await createFilm(newFilm);
 */
export async function createFilm(filmData: NewFilm): Promise<any> {
  try {
    console.log('📤 Sending POST request...');
    console.log('📦 Data:', filmData);

    const response = await fetch(`${MOCK_API}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Jika butuh authentication:
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
      },
      body: JSON.stringify(filmData), // Convert object ke JSON string
    });

    console.log('📊 Status:', response.status);

    if (!response.ok) {
      // Coba ambil error message dari server
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal membuat film baru');
    }

    const result = await response.json();
    console.log('✅ Film created:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating film:', error);
    throw error;
  }
}

/**
 * POST - Contoh dengan FormData (untuk upload file)
 * Digunakan ketika perlu upload gambar/file
 */
export async function createFilmWithImage(
  filmData: NewFilm,
  imageUri: string
): Promise<any> {
  try {
    // FormData untuk kirim file
    const formData = new FormData();
    
    // Append text fields
    formData.append('title', filmData.title);
    formData.append('director', filmData.director);
    
    // Append file
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Sesuaikan dengan tipe file
      name: 'photo.jpg',
    } as any);

    const response = await fetch(`${MOCK_API}/posts`, {
      method: 'POST',
      headers: {
        // JANGAN set Content-Type untuk FormData
        // Browser/RN akan set otomatis dengan boundary
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload gagal');
    }

    return response.json();
  } catch (error) {
    console.error('❌ Error uploading:', error);
    throw error;
  }
}

// ==================== PUT METHOD ====================

/**
 * PUT - Update/replace seluruh data film
 * Method: PUT
 * Endpoint: /posts/:id
 * 
 * PUT mengganti SELURUH object, jadi semua field harus diisi
 */
export async function updateFilmComplete(
  id: string,
  filmData: NewFilm
): Promise<any> {
  try {
    console.log('🔄 Sending PUT request...');
    console.log('🆔 ID:', id);
    console.log('📦 Data:', filmData);

    const response = await fetch(`${MOCK_API}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    if (!response.ok) {
      throw new Error('Gagal update film');
    }

    const result = await response.json();
    console.log('✅ Film updated:', result);
    return result;
  } catch (error) {
    console.error('❌ Error updating film:', error);
    throw error;
  }
}

// ==================== PATCH METHOD ====================

/**
 * PATCH - Update sebagian data film
 * Method: PATCH
 * Endpoint: /posts/:id
 * 
 * PATCH hanya update field yang dikirim, field lain tetap sama
 * 
 * CONTOH:
 * await patchFilm('123', { title: 'New Title' });
 * // Hanya title yang berubah, field lain tetap
 */
export async function patchFilm(
  id: string,
  partialData: Partial<NewFilm>
): Promise<any> {
  try {
    console.log('🔧 Sending PATCH request...');
    console.log('🆔 ID:', id);
    console.log('📦 Partial Data:', partialData);

    const response = await fetch(`${MOCK_API}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partialData),
    });

    if (!response.ok) {
      throw new Error('Gagal patch film');
    }

    const result = await response.json();
    console.log('✅ Film patched:', result);
    return result;
  } catch (error) {
    console.error('❌ Error patching film:', error);
    throw error;
  }
}

// ==================== DELETE METHOD ====================

/**
 * DELETE - Menghapus film
 * Method: DELETE
 * Endpoint: /posts/:id
 */
export async function deleteFilm(id: string): Promise<void> {
  try {
    console.log('🗑️  Sending DELETE request...');
    console.log('🆔 ID:', id);

    const response = await fetch(`${MOCK_API}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus film');
    }

    // DELETE biasanya return 204 No Content atau 200 OK
    if (response.status === 204) {
      console.log('✅ Film deleted (no content)');
      return;
    }

    const result = await response.json();
    console.log('✅ Film deleted:', result);
  } catch (error) {
    console.error('❌ Error deleting film:', error);
    throw error;
  }
}

/**
 * DELETE - Batch delete (hapus banyak sekaligus)
 * Menghapus multiple films dalam satu operasi
 */
export async function deleteMultipleFilms(ids: string[]): Promise<void> {
  try {
    console.log('🗑️  Deleting multiple films:', ids);

    // Promise.all menjalankan semua request bersamaan
    const deletePromises = ids.map((id) => deleteFilm(id));
    await Promise.all(deletePromises);

    console.log('✅ All films deleted');
  } catch (error) {
    console.error('❌ Error deleting multiple films:', error);
    throw error;
  }
}

// ==================== ADVANCED: DENGAN AUTHENTICATION ====================

/**
 * Helper function untuk request dengan auth token
 */
async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Tambahkan auth token jika ada
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * POST - Login example
 */
export async function login(email: string, password: string): Promise<any> {
  try {
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login gagal');
    }

    const data = await response.json();
    console.log('✅ Login success:', data);
    return data; // { token: '...' }
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}

/**
 * GET - Fetch dengan authentication
 */
export async function getProtectedData(token: string): Promise<any> {
  try {
    const response = await fetchWithAuth(
      `${MOCK_API}/posts`,
      { method: 'GET' },
      token
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Token invalid atau expired');
      }
      throw new Error('Request gagal');
    }

    return response.json();
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// ==================== ERROR HANDLING HELPER ====================

/**
 * Centralized error handler
 */
export function handleApiError(error: any): string {
  if (error instanceof TypeError) {
    return 'Network error - Cek koneksi internet Anda';
  }

  if (error.message) {
    return error.message;
  }

  return 'Terjadi kesalahan tidak diketahui';
}

// ==================== TIMEOUT HELPER ====================

/**
 * Fetch dengan timeout
 * Batalkan request jika terlalu lama
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  // Create abort controller
  const controller = new AbortController();
  const signal = controller.signal;

  // Set timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Server tidak merespon');
    }

    throw error;
  }
}

// ==================== RETRY HELPER ====================

/**
 * Retry request jika gagal
 * Berguna untuk request yang kadang timeout
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 Attempt ${i + 1}/${maxRetries}...`);
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      // Jika status 5xx (server error), retry
      if (response.status >= 500) {
        lastError = new Error(`Server error: ${response.status}`);
        continue;
      }

      // Jika error lain (4xx), jangan retry
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// ==================== EXPORT ALL ====================
export default {
  // GET
  getFilms,
  getFilmById,
  getFilmsWithQuery,
  
  // POST
  createFilm,
  createFilmWithImage,
  login,
  
  // PUT
  updateFilmComplete,
  
  // PATCH
  patchFilm,
  
  // DELETE
  deleteFilm,
  deleteMultipleFilms,
  
  // Helpers
  handleApiError,
  fetchWithTimeout,
  fetchWithRetry,
};

