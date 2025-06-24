import { useState, useEffect } from 'react';
import { HotpotBase, Review } from '../types';
import { fetchHotpotBases, fetchReviews, submitReview, GoogleSheetsHotpotBase, GoogleSheetsReview } from '../utils/googleSheets';
import { useLocalStorage } from './useLocalStorage';

export const useGoogleSheets = () => {
  const [hotpotBases, setHotpotBases] = useState<HotpotBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fallback to localStorage if Google Sheets is not available
  const [localReviews, setLocalReviews] = useLocalStorage<Review[]>('reviews', []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch hotpot bases and reviews from Google Sheets
      const [basesData, reviewsData] = await Promise.all([
        fetchHotpotBases(),
        fetchReviews()
      ]);
      
      console.log('🔄 开始处理数据关联...');
      console.log('📊 锅底数据:', basesData);
      console.log('📊 评价数据:', reviewsData);
      
      // Get valid hotpot base IDs
      const validBaseIds = new Set(basesData.map(base => base.id));
      console.log('✅ 有效的锅底ID:', Array.from(validBaseIds));
      
      // Filter reviews to only include those with valid hotpot base IDs
      const validReviews = reviewsData.filter(review => validBaseIds.has(review.hotpotBaseId));
      console.log('✅ 有效评价数量:', validReviews.length);
      console.log('❌ 无效评价数量:', reviewsData.length - validReviews.length);
      
      // Transform Google Sheets data to app format
      const transformedBases: HotpotBase[] = basesData.map((base: GoogleSheetsHotpotBase) => {
        const baseReviews = validReviews
          .filter((review: GoogleSheetsReview) => review.hotpotBaseId === base.id)
          .map((review: GoogleSheetsReview) => ({
            id: review.id,
            userName: review.userName,
            userPhone: review.userPhone,
            rating: review.rating,
            comment: review.comment,
            timestamp: review.timestamp,
            hotpotBaseId: review.hotpotBaseId
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        
        const totalRatings = baseReviews.length;
        const averageRating = totalRatings > 0 
          ? baseReviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings 
          : 0;
        
        console.log(`📋 锅底 ${base.name_zh} (${base.id}): ${totalRatings} 条评价, 平均评分 ${averageRating.toFixed(1)}`);
        
        return {
          id: base.id,
          name: {
            th: base.name_th,
            zh: base.name_zh,
            en: base.name_en
          },
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings,
          reviews: baseReviews
        };
      });
      
      console.log('✅ 最终处理结果:', transformedBases.map(b => ({ 
        id: b.id, 
        name: b.name.zh, 
        totalRatings: b.totalRatings, 
        averageRating: b.averageRating 
      })));
      
      setHotpotBases(transformedBases);
    } catch (err) {
      console.error('Error loading data from Google Sheets:', err);
      setError('Failed to load data from Google Sheets, using local storage');
      
      // Fallback to local data
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    // Fallback hotpot bases
    const fallbackBases: HotpotBase[] = [
      {
        id: 'traditional',
        name: { th: 'น้ำซุปแดงแบบดั้งเดิม', zh: '传统红汤锅底', en: 'Traditional Red Soup' },
        averageRating: 0,
        totalRatings: 0,
        reviews: []
      },
      {
        id: 'spicy',
        name: { th: 'น้ำซุปมาล่า', zh: '麻辣锅底', en: 'Spicy Mala Soup' },
        averageRating: 0,
        totalRatings: 0,
        reviews: []
      },
      {
        id: 'mushroom',
        name: { th: 'น้ำซุปเห็ด', zh: '菌菇锅底', en: 'Mushroom Soup' },
        averageRating: 0,
        totalRatings: 0,
        reviews: []
      },
      {
        id: 'tomato',
        name: { th: 'น้ำซุปมะเขือเทศ', zh: '番茄锅底', en: 'Tomato Soup' },
        averageRating: 0,
        totalRatings: 0,
        reviews: []
      },
      {
        id: 'clear',
        name: { th: 'น้ำซุปใส', zh: '清汤锅底', en: 'Clear Soup' },
        averageRating: 0,
        totalRatings: 0,
        reviews: []
      }
    ];

    // Apply local reviews to bases
    const basesWithReviews = fallbackBases.map(base => {
      const baseReviews = localReviews.filter(review => review.hotpotBaseId === base.id);
      const totalRatings = baseReviews.length;
      const averageRating = totalRatings > 0 
        ? baseReviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings 
        : 0;
      
      return {
        ...base,
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings,
        reviews: baseReviews.sort((a, b) => b.timestamp - a.timestamp)
      };
    });

    setHotpotBases(basesWithReviews);
  };

  const addReview = async (review: Review): Promise<boolean> => {
    try {
      // Try to submit to Google Sheets first
      const googleSheetsReview: GoogleSheetsReview = {
        id: review.id,
        userName: review.userName,
        userPhone: review.userPhone,
        rating: review.rating,
        comment: review.comment,
        timestamp: review.timestamp,
        hotpotBaseId: review.hotpotBaseId
      };
      
      const success = await submitReview(googleSheetsReview);
      
      if (success) {
        // Reload data from Google Sheets
        await loadData();
        return true;
      } else {
        // Fallback to local storage
        const updatedReviews = [review, ...localReviews];
        setLocalReviews(updatedReviews);
        
        // Update local state
        const updatedBases = hotpotBases.map(base => {
          if (base.id === review.hotpotBaseId) {
            const baseReviews = [review, ...base.reviews];
            const totalRatings = baseReviews.length;
            const averageRating = baseReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
            
            return {
              ...base,
              reviews: baseReviews,
              totalRatings,
              averageRating: Number(averageRating.toFixed(1))
            };
          }
          return base;
        });
        
        setHotpotBases(updatedBases);
        return true;
      }
    } catch (err) {
      console.error('Error adding review:', err);
      return false;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    hotpotBases,
    loading,
    error,
    addReview,
    refreshData: loadData
  };
};