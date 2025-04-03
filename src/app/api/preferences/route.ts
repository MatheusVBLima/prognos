import { NextRequest, NextResponse } from "next/server";
import { defaultPreferences, UserPreferences } from "@/types/preferences";

// Mock de armazenamento de preferências - em produção seria integrado com o Supabase
const userPreferencesStore = new Map<string, UserPreferences>();

// Função auxiliar para obter o ID do usuário da request
// Em produção, isso seria feito com autenticação real
function getUserId(req: NextRequest): string {
    // Simulação: usar um header específico ou cookie
    const userId = req.headers.get("x-user-id") || "default-user";
    return userId;
}

// GET /api/preferences - Obter preferências do usuário
export async function GET(req: NextRequest) {
    try {
        const userId = getUserId(req);

        // Verifica se o usuário tem preferências salvas
        let userPrefs = userPreferencesStore.get(userId);

        // Se não tiver, usa as preferências padrão
        if (!userPrefs) {
            userPrefs = { ...defaultPreferences };
            userPreferencesStore.set(userId, userPrefs);
        }

        return NextResponse.json({
            success: true,
            data: userPrefs
        });
    } catch (error) {
        console.error("Erro ao obter preferências:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao obter preferências do usuário"
            },
            { status: 500 }
        );
    }
}

// PUT /api/preferences - Atualizar preferências do usuário
export async function PUT(req: NextRequest) {
    try {
        const userId = getUserId(req);

        // Obter dados do body
        const requestData = await req.json();

        // Verificar se o usuário já tem preferências
        const existingPrefs = userPreferencesStore.get(userId) || { ...defaultPreferences };

        // Mesclar preferências existentes com as novas
        const updatedPrefs = {
            ...existingPrefs,
            ...requestData,
            // Mescla explícita de objetos aninhados
            notificationTypes: {
                ...existingPrefs.notificationTypes,
                ...(requestData.notificationTypes || {})
            }
        };

        // Salvar preferências atualizadas
        userPreferencesStore.set(userId, updatedPrefs);

        return NextResponse.json({
            success: true,
            data: updatedPrefs
        });
    } catch (error) {
        console.error("Erro ao atualizar preferências:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao atualizar preferências do usuário"
            },
            { status: 500 }
        );
    }
}

// PATCH /api/preferences - Atualizar parcialmente preferências
export async function PATCH(req: NextRequest) {
    try {
        const userId = getUserId(req);

        // Obter dados do body
        const requestData = await req.json();

        // Verificar se o usuário já tem preferências
        const existingPrefs = userPreferencesStore.get(userId);

        if (!existingPrefs) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Preferências do usuário não encontradas"
                },
                { status: 404 }
            );
        }

        // Mesclar preferências existentes com as novas
        const updatedPrefs = {
            ...existingPrefs,
            ...requestData,
            // Mescla explícita de objetos aninhados se presentes
            notificationTypes: requestData.notificationTypes
                ? {
                    ...existingPrefs.notificationTypes,
                    ...requestData.notificationTypes
                }
                : existingPrefs.notificationTypes
        };

        // Salvar preferências atualizadas
        userPreferencesStore.set(userId, updatedPrefs);

        return NextResponse.json({
            success: true,
            data: updatedPrefs
        });
    } catch (error) {
        console.error("Erro ao atualizar preferências:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao atualizar preferências do usuário"
            },
            { status: 500 }
        );
    }
}

// DELETE /api/preferences - Resetar preferências para o padrão
export async function DELETE(req: NextRequest) {
    try {
        const userId = getUserId(req);

        // Resetar para as preferências padrão
        userPreferencesStore.set(userId, { ...defaultPreferences });

        return NextResponse.json({
            success: true,
            data: { ...defaultPreferences },
            message: "Preferências resetadas com sucesso"
        });
    } catch (error) {
        console.error("Erro ao resetar preferências:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao resetar preferências do usuário"
            },
            { status: 500 }
        );
    }
} 