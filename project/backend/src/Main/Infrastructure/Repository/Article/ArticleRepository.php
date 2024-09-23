<?php

namespace App\Main\Infrastructure\Repository\Article;

use App\Main\Domain\Model\Article;
use App\Main\Domain\Repository\Interfaces\Article\IArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class ArticleRepository implements IArticleRepository
{
    private EntityRepository $repository;

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $this->entityManager->getRepository(Article::class);
    }

    /**
     * @return Article[]
     */
    public function findAll(): array
    {
        return $this->repository->findAll();
    }

    public function save(Article $article): void
    {
        $this->entityManager->persist($article);
        $this->entityManager->flush();
    }

    public function update(Article $article): void
    {
        $this->entityManager->persist($article);
        $this->entityManager->flush();
    }

    public function delete(string $id): void
    {
        $article = $this->find($id);
        if ($article !== null) {
            $this->entityManager->remove($article);
            $this->entityManager->flush();
        }
    }

    public function find(string $id): ?Article
    {
        return $this->repository->find($id);
    }

    public function findById(string $id): ?Article
    {
        return $this->repository->find($id);
    }

    /**
     * Busca todos los artículos de un usuario por su UUID
     *
     * @param string $userId
     * @return Article[]
     */
    public function findAllByUserId(string $userId): array
    {
        return $this->repository->findBy(['author' => $userId]);
    }

    /**
     * Busca un artículo específico de un usuario por el UUID del autor y el UUID del artículo
     *
     * @param string $userId
     * @param string $articleId
     * @return Article|null
     */
    public function findByUserIdAndArticleId(string $userId, string $articleId): ?Article
    {
        return $this->repository->findOneBy([
            'author' => $userId,
            'id' => $articleId
        ]);
    }
}
