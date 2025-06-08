/**
 * 従業員申請のビジネスロジック関連のカスタムフック集
 *
 * このファイルには、従業員申請に関するビジネスロジックとAPI操作が
 * まとめられています。UI操作とは分離されており、データの取得・更新・削除
 * および未登録グループの管理を行います。
 *
 * 主な機能：
 * - 従業員データのCRUD操作
 * - 従業員申請の送信処理
 * - 未登録グループの管理
 * - エラーハンドリングとトースト通知
 */
import {
  useCreateEmployee,
  useDeleteEmployee,
  useGetEmployees,
  useUpdateEmployee,
  useUpsertEmployees,
} from '@/api/employeesApi';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
  useMutateUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { EmployeeFormItem } from './schema';

/**
 * 従業員API操作の基本機能を提供するhook
 *
 * 従業員データのCRUD操作を行うAPIクライアントを提供します。
 * 各操作にはエラーハンドリングとデータ再取得が含まれています。
 *
 * @param groupId - 対象のグループID
 * @returns API操作メソッドとローディング状態
 */
export const useEmployeesApiClient = (groupId: number) => {
  // 従業員データ取得とミューテーション関数の取得
  const {
    employees: getEmployeesData,
    isLoading,
    hasError,
    mutateEmployees,
  } = useGetEmployees(groupId);

  // 各CRUD操作のAPI hooks
  const { trigger: createEmployee, isMutating: isCreating } =
    useCreateEmployee();
  const { trigger: updateEmployee, isMutating: isUpdating } =
    useUpdateEmployee()();
  const { trigger: upsertEmployees, isMutating: isUpserting } =
    useUpsertEmployees();
  const { trigger: deleteEmployee, isMutating: isDeleting } =
    useDeleteEmployee()();

  /**
   * 従業員新規作成処理
   * @param employees - 作成する従業員データ（配列の最初の要素を使用）
   */
  const handleCreate = async (employees: EmployeeFormItem[]) => {
    try {
      await createEmployee({
        body: {
          group_id: groupId,
          name: employees[0].name,
          student_id: employees[0].studentId,
          stool_test_id: 1, // 固定値
        },
      });
      await mutateEmployees(); // データ再取得
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  };

  /**
   * 従業員更新処理
   * @param employees - 更新する従業員データ（配列の最初の要素を使用）
   */
  const handleUpdate = async (employees: EmployeeFormItem[]) => {
    const id = employees[0].id;
    if (!id) {
      throw new Error('Employee ID is required');
    }
    try {
      await updateEmployee({
        id,
        body: {
          id,
          group_id: groupId,
          name: employees[0].name,
          student_id: employees[0].studentId,
          stool_test_id: 1,
        },
      });
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  /**
   * 従業員一括更新処理（複数従業員の作成・更新を一度に実行）
   * @param employees - 処理する従業員データの配列
   */
  const handleUpsert = async (employees: EmployeeFormItem[]) => {
    try {
      await upsertEmployees({
        body: {
          employees: employees.map((employee) => ({
            group_id: groupId,
            name: employee.name,
            student_id: employee.studentId,
            stool_test_id: 1,
            ...(employee.id && { id: employee.id }), // IDがある場合のみ含める
          })),
        },
      });
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to upsert employees:', error);
      throw error;
    }
  };

  /**
   * 従業員削除処理
   * @param id - 削除する従業員のID
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  return {
    getEmployeesData,
    isLoading,
    isCreating,
    isUpdating,
    isUpserting,
    isDeleting,
    hasError,
    mutateEmployees,
    createEmployee: handleCreate,
    updateEmployee: handleUpdate,
    upsertEmployees: handleUpsert,
    deleteEmployee: handleDelete,
  };
};

/**
 * 従業員申請のビジネスロジックを管理するhook
 *
 * 従業員申請の送信処理、従業員データの操作、成功・失敗時の
 * トースト通知などのビジネスロジックを提供します。
 *
 * @param groupId - 対象のグループID
 * @param callbacks - 成功・失敗時のコールバック関数
 * @returns ビジネスロジック操作のメソッド群
 */
export const useEmployeesBusinessLogic = (
  groupId: number,
  callbacks: {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
  }
) => {
  const {
    getEmployeesData,
    mutateEmployees,
    createEmployee,
    upsertEmployees,
    isCreating,
    isUpserting,
    deleteEmployee,
    updateEmployee,
  } = useEmployeesApiClient(groupId);

  /**
   * 従業員申請「いいえ」（従業員を申請する）の場合の送信処理
   * 従業員数に応じて単一作成/更新または一括処理を選択します
   */
  const handleEmployeeApplicationSubmit = async (data: {
    needApplication: 'yes' | 'no';
    employees: EmployeeFormItem[];
  }) => {
    try {
      if (data.employees.length === 1) {
        // 従業員が1人の場合：単一作成または更新
        const employee = data.employees[0];
        if (employee?.id) {
          await updateEmployee([employee]); // 既存従業員の更新
        } else {
          await createEmployee(data.employees); // 新規従業員の作成
        }
      } else {
        // 従業員が複数の場合：一括処理
        await upsertEmployees(data.employees);
      }
      await mutateEmployees();
      callbacks.onSuccess?.('従業員申請が完了しました');
    } catch (error) {
      console.error('Error in employee application:', error);
      callbacks.onError?.('登録に失敗しました');
      throw error;
    }
  };

  /**
   * 従業員申請「はい」（従業員申請しない）の場合の送信処理
   * 既存の従業員データがあれば全て削除します
   */
  const handleNoApplicationSubmit = async () => {
    try {
      // 既存の従業員データがあれば削除
      if (getEmployeesData && getEmployeesData.length > 0) {
        for (const employee of getEmployeesData) {
          if (employee.id) {
            await deleteEmployee(employee.id);
          }
        }
        await mutateEmployees();
      }
      callbacks.onSuccess?.('従業員申請を行わない登録が完了しました');
    } catch (error) {
      console.error('Error in no application:', error);
      callbacks.onError?.('登録に失敗しました');
      throw error;
    }
  };

  /**
   * 従業員個別削除処理（トースト通知付き）
   * フォーム内での従業員削除時に使用します
   */
  const handleEmployeeDeleteWithToast = async (employeeId: number) => {
    try {
      await deleteEmployee(employeeId);
      callbacks.onSuccess?.('従業員を削除しました');
      await mutateEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      callbacks.onError?.('削除に失敗しました');
      throw error;
    }
  };

  return {
    getEmployeesData,
    mutateEmployees,
    isCreating,
    isUpserting,
    handleEmployeeApplicationSubmit,
    handleNoApplicationSubmit,
    handleEmployeeDeleteWithToast,
  };
};

/**
 * 未登録グループ関連のロジックを管理するhook
 *
 * 「代表と副代表だけで活動する」選択をした場合の未登録グループの
 * 登録・削除処理を管理します。
 *
 * @param groupId - 対象のグループID
 * @param callbacks - 成功・失敗時のコールバック関数
 * @returns 未登録グループ操作のメソッド群
 */
export const useUnregisteredGroupLogic = (
  groupId: number,
  callbacks: {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
  }
) => {
  // 未登録グループの操作API
  const { registerUnregisteredGroup, deleteUnregisteredGroup } =
    useMutateUnregisteredGroup(ORDER_TYPES.EMPLOYEE);

  // 未登録グループデータの取得
  const { unregisteredData, mutateUnregisteredGroup } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.EMPLOYEE
  );

  /**
   * 未登録グループを登録する
   * 「代表と副代表だけで活動する」を選択した場合に実行
   */
  const handleRegisterUnregisteredGroup = async () => {
    try {
      await registerUnregisteredGroup(groupId);
      await mutateUnregisteredGroup(); // データ再取得
    } catch (error) {
      console.error('Error registering unregistered group:', error);
      callbacks.onError?.('登録に失敗しました');
      throw error;
    }
  };

  /**
   * 未登録グループを削除する
   * 「従業員を申請する」に変更した場合に実行
   */
  const handleDeleteUnregisteredGroup = async () => {
    try {
      if (unregisteredData) {
        await deleteUnregisteredGroup(unregisteredData);
        await mutateUnregisteredGroup();
      }
    } catch (error) {
      console.error('Error deleting unregistered group:', error);
      callbacks.onError?.('削除に失敗しました');
      throw error;
    }
  };

  return {
    unregisteredData,
    mutateUnregisteredGroup,
    handleRegisterUnregisteredGroup,
    handleDeleteUnregisteredGroup,
  };
};
