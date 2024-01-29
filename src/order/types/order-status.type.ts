export const OrderStatus = {
  PURCHASE_COMPLETED: 0, //결제 완료
  SHIPPING: 1, //배송 중
  DELIVERY_COMPLETED: 2, //배송 완료
  PURCHASE_CONFIRM: 3, //구매 확정 -  리뷰 작성 가능한 상태
  REFUND_COMPLETED: 4, //결제 취소 - 배송 전에만 가능
  RETURN_REQUEST: 5, //반품 신청
  RETURN_COMPLETED: 6, //반품 완료
  EXCHANGE_REQUEST: 7, //교환 신청 : db에는 저장되지 않는 값
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
