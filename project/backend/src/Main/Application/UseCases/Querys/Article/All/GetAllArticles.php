<?php

namespace App\Main\Application\UseCases\Querys\Article\All;

use App\Main\Domain\Exception\StoreException;
use App\Main\Domain\Repository\Interfaces\Article\IArticleRepository;
use App\Main\Domain\Repository\Interfaces\User\IUserRepository;

final readonly class GetAllArticles
{
    public function __construct(
        private IUserRepository $repository,
        private IArticleRepository $articleRepository
    )
    {}

    /**
     * @throws StoreException
     */
    public function __invoke(GetAllArticlesQuery $query): array
    {
        try {
            if ($query->all()){
                $articles = $this->articleRepository->findAll();
                return array_map(fn($article) => $article->toArray(), $articles);
            }else{
                $user = $this->repository->findByEmail($query->userId());
                $articles = $this->articleRepository->findAllByUserId($user->getId());
                return array_map(fn($article) => $article->toArray(), $articles);
            }
        } catch (\Exception $e) {
            throw new StoreException('Error fetching articles from repository: ' . $e->getMessage());
        }
    }
}
