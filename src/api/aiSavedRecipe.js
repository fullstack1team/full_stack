// 중복적인 데이터를 불러오는 함수들은 api 폴더에 모아둠

const BASE_URL = "http://localhost:10000"

// 저장 레시피 전체 목록 조회
export const getSavedRecipes = async (memberId) => {
  const response = await fetch(`${BASE_URL}/aisavedrecipe/member/${memberId}`, {
    method: "GET",
    credentials: "include"
  })
  
  if (!response.ok){
    throw new Error("저장 레시피 조회 실패")
  }

  return response.json() 
}

// 레시피 저장
export const savedRecipe = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/aisavedrecipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(({recipeId}))
  })
  
  if (!response.ok) {
    throw new Error("레시피 저장 실패")
  }

  return response.json()

}

// 레시피 삭제
export const deleteSavedRecipe = async (savedRecipeId) => {
  const response = await fetch(`${BASE_URL}/aisavedrecipe/${savedRecipeId}`, {
    method: "DELETE",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("레시피 삭제 실패")
  }

  return response.json()
}